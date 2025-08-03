import React, { useEffect, useState ,useRef} from "react";

const defaultThemes = [
  {
    name: "Rustic",
    texture: "brick",
    color: "yellow",
    thumbnail: "http://localhost:5000/textures/brick.jpg",
  },
  {
    name: "Modern",
    texture: "marble",
    color: "white",
    thumbnail: "http://localhost:5000/textures/marble.jpg",
  },
  {
    name: "Natural",
    texture: "wood",
    color: "green",
    thumbnail: "http://localhost:5000/textures/wood.jpg",
  },
];

// 🟢 Dummy recommended colors
const recommendedColors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff"];

function ARpage() {
  const [title, setTitle] = useState("");
  const [savedDesigns, setSavedDesigns] = useState([]);
  const arRootRef = useRef(null);

  // ✅ Fetch saved designs on load
  useEffect(() => {
    fetch("http://localhost:5000/api/designs")
      .then((res) => res.json())
      .then((data) => setSavedDesigns(data))
      .catch((err) => console.error("Failed to fetch designs:", err));
  }, []);

  // ✅ Insert AR scene when component mounts
  useEffect(() => {
    const sceneHTML = `
      <a-scene
        embedded
        arjs="sourceType: webcam;"
        renderer="logarithmicDepthBuffer: true;"
        vr-mode-ui="enabled: false"
      >
        <a-assets>
          <img id="brick" src="http://localhost:5000/textures/brick.jpg" />
          <img id="wood" src="http://localhost:5000/textures/wood.jpg" />
          <img id="marble" src="http://localhost:5000/textures/marble.jpg" />
        </a-assets>

        <a-marker preset="hiro">
          <a-box id="paint-box"
            position="0 1 0"
            rotation="-90 0 0"
            depth="0.05"
            height="1.5"
            width="2.5"
            material="src: #brick; color: yellow;"
          ></a-box>
        </a-marker>

        <a-entity camera></a-entity>
      </a-scene>
    `;

    document.getElementById("ar-root").innerHTML = sceneHTML;
  }, []);

  // ✅ Save design to backend
  const saveDesign = async () => {
    const box = document.querySelector("#paint-box");
    if (!box) return alert("❌ Paint box not found");

    const material = box.getAttribute("material");
    const color = material.color || "unknown";

    let texture = "none";
    if (typeof material.src === "string") {
      texture = material.src.replace("#", "");
    } else if (material.src && material.src.id) {
      texture = material.src.id;
    }

    try {
      const response = await fetch("http://localhost:5000/api/save-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, texture, color }),
      });

      const result = await response.json();
      alert(`✅ ${result.message}`);

      // Refresh saved designs
      const refreshed = await fetch("http://localhost:5000/api/designs");
      setSavedDesigns(await refreshed.json());
    } catch (err) {
      console.error(err);
      alert("❌ Error saving design");
    }
  };

  // ✅ Apply theme using A-Frame’s built-in Three.js
  const applyTheme = (textureId, color) => {
    const box = document.querySelector("#paint-box");
    if (!box) return;

    const mesh = box.getObject3D("mesh");
    if (!mesh || !mesh.material) return;

    const material = mesh.material;

    // 🎨 Color-only
    if (!textureId || textureId === "none") {
      material.map = null;
      material.color.set(color || "#ffffff");
      material.needsUpdate = true;
      return;
    }

    // 🎨 Default textures from a-assets
    const img = document.querySelector(`#${textureId}`);
    if (!img) return;

    const texLoader = new window.THREE.TextureLoader(); // ✅ Use A-Frame’s Three.js
    texLoader.load(img.src, (tex) => {
      tex.generateMipmaps = false;
      tex.minFilter = window.THREE.LinearFilter;
      tex.magFilter = window.THREE.LinearFilter;
      material.map = tex;
      material.color.set("#ffffff");
      material.needsUpdate = true;
    });
  };

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      {/* 🎨 Controls */}
      <div
        style={{
          position: "absolute",
          zIndex: 10,
          top: 10,
          left: 10,
          background: "rgba(255,255,255,0.9)",
          padding: "12px",
          borderRadius: "8px",
          width: "220px",
        }}
      >
        <input
          type="text"
          placeholder="Enter design title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            marginBottom: "8px",
            padding: "6px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "100%",
          }}
        />
        <button
          onClick={saveDesign}
          style={{
            marginBottom: "12px",
            width: "100%",
            padding: "6px",
            borderRadius: "4px",
            background: "#28a745",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          💾 Save Design
        </button>

        {/* 🔹 Recommended Colors Placeholder */}
        <div style={{ marginBottom: "12px" }}>
          <h4 style={{ fontSize: "14px", marginBottom: "6px" }}>
            Recommended Colors
          </h4>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {recommendedColors.map((color, idx) => (
              <div
                key={idx}
                onClick={() => applyTheme("none", color)}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  backgroundColor: color,
                  cursor: "pointer",
                  border: "2px solid #fff",
                  boxShadow: "0 0 3px rgba(0,0,0,0.3)",
                }}
              />
            ))}
          </div>
        </div>

        {/* 🔹 Default Theme Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {defaultThemes.map((theme, i) => (
            <div
              key={i}
              onClick={() => applyTheme(theme.texture, theme.color)}
              style={{
                cursor: "pointer",
                textAlign: "center",
                border: "1px solid #ccc",
                padding: "6px",
                borderRadius: "8px",
                background: "#f9f9f9",
              }}
            >
              <img
                src={theme.thumbnail}
                alt={theme.name}
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                  borderRadius: "4px",
                  marginBottom: "4px",
                }}
              />
              <div style={{ fontSize: "12px" }}>{theme.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 📦 Saved Designs */}
      <div
        style={{
          background: "#fff",
          padding: "10px",
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 10,
          maxHeight: "300px",
          overflowY: "auto",
          borderRadius: "8px",
          width: "180px",
        }}
      >
        <h3>Saved Designs</h3>
        {savedDesigns.length === 0 ? (
          <p>No saved designs yet.</p>
        ) : (
          savedDesigns.map((design, i) => (
            <div
              key={i}
              onClick={() => applyTheme(design.texture, design.color)}
              style={{
                marginBottom: "10px",
                cursor: "pointer",
                padding: "5px",
                border: "1px solid #ddd",
                borderRadius: "6px",
              }}
            >
              <strong>{design.title || "Untitled"}</strong>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: design.color,
                  marginTop: "4px",
                  border: "1px solid #aaa",
                  borderRadius: "4px",
                }}
              ></div>
            </div>
          ))
        )}
      </div>

      {/* 📷 AR Scene */}
      <div id="ar-root" style={{ width: "100vw", height: "100vh" }}></div>
    </div>
  );
}

export default ARpage;
