import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
const defaultThemes = [
  {
    name: "Rustic",
    texture: "brick",
    color: "yellow",
    thumbnail: "http://localhost:5000/textures/brick.jpg"
  },
  {
    name: "Modern",
    texture: "marble",
    color: "white",
    thumbnail: "http://localhost:5000/textures/marble.jpg"
  },
  {
    name: "Natural",
    texture: "wood",
    color: "green",
    thumbnail: "http://localhost:5000/textures/wood.jpg"
  }
];

function App() {
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [savedDesigns, setSavedDesigns] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/designs')
      .then(res => res.json())
      .then(data => setSavedDesigns(data))
      .catch(err => console.error('Failed to fetch designs:', err));
  }, []);

  const saveDesign = async () => {
    const box = document.querySelector('#paint-box');
    if (!box) {
      alert('❌ Paint box not found');
      return;
    }

    const material = box.getAttribute('material');
    const color = material.color || 'unknown';

    let texture = 'none';
    if (typeof material.src === 'string') {
      texture = material.src.replace('#', '');
    } else if (material.src && material.src.id) {
      texture = material.src.id;
    }

    try {
      const response = await fetch('http://localhost:5000/api/save-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title,texture, color })
      });

      const result = await response.json();
      alert(`✅ ${result.message}`);

      // Reload saved designs
      const newData = await fetch('http://localhost:5000/api/designs');
      const designs = await newData.json();
      setSavedDesigns(designs);

    } catch (err) {
      console.error(err);
      alert('❌ Error saving design');
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this design?");
    if (!confirm) return;

    try {
      const response = await fetch(`http://localhost:5000/api/delete-design/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSavedDesigns(prev => prev.filter(d => d._id !== id));
        alert('🗑️ Design deleted');
      } else {
        alert('❌ Failed to delete design');
      }
    } catch (err) {
      console.error(err);
      alert('❌ Error deleting design');
    }
  };

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
        material="src: #brick; color: yellow;">
      </a-box>
    </a-marker>

    <a-entity camera></a-entity>
  </a-scene>
`;

    document.getElementById("ar-root").innerHTML = sceneHTML;
  }, []);

 const applyTheme = (textureId, color) => {
  try {
    const box = document.querySelector('#paint-box');
    if (!box) return;

    // Get the underlying Three.js mesh
    const mesh = box.getObject3D('mesh');
    if (!mesh || !mesh.material) return;
    const material = mesh.material;

    const isDefault = ['brick', 'wood', 'marble'].includes(textureId);

    // 🎨 CASE 1: Color-only designs (texture === 'none')
    if (!textureId || textureId === 'none') {
      material.map = null;
      material.color.set(color || '#ffffff');
      material.needsUpdate = true;
      console.log(`🎨 Applied color only: ${color}`);
      return;
    }

    // 🎨 CASE 2: Default textures
    if (isDefault) {
      const img = document.querySelector(`#${textureId}`);
      if (!img) return;

      new THREE.TextureLoader().load(img.src, (tex) => {
        tex.generateMipmaps = false;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        material.map = tex;
        material.color.set('#ffffff');
        material.needsUpdate = true;
        console.log(`🎨 Applied default: ${textureId} + ${color}`);
      });
      return;
    }

    // 🎨 CASE 3: Uploaded textures
    // 🎨 CASE 3: Uploaded textures
const imgUrl = `http://localhost:5000/textures/${textureId}.jpg`;

// ⬇️ ADD THIS HERE
if (
  textureId === 'none' ||
  (textureId.startsWith('tex_') && !document.querySelector(`#${CSS.escape(textureId)}`))
) {
  // Color-only fallback
  material.map = null;
  material.color.set(color || '#ffffff');
  material.needsUpdate = true;
  console.warn(`⚠️ Texture not found, applying color only: ${color}`);
  return; // ⬅️ Important to exit function here
}

const loader = new THREE.TextureLoader();
loader.load(
  imgUrl,
  (tex) => {
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    material.map = tex;
    material.color.set('#ffffff');
    material.needsUpdate = true;
    console.log(`🎨 Applied uploaded: ${textureId} + ${color}`);
  },
  undefined,
  (err) => console.error(`❌ Failed to load uploaded texture: ${textureId}`, err)
);

  
  } catch (err) {
    console.error('❌ applyTheme crashed:', err);
  }
};

  const saveTitle = async (id) => {
  try {
    await fetch(`http://localhost:5000/api/designs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editedTitle }),
    });
    setEditingId(null);
    setEditedTitle('');
    // Reload designs
    const res = await fetch('http://localhost:5000/api/designs');
    const updated = await res.json();
    setSavedDesigns(updated);
  } catch (err) {
    console.error('Failed to update title:', err);
    alert('❌ Failed to update title');
  }
};
  const textureImages = {
  brick: 'http://localhost:5000/textures/brick.jpg',
  wood: 'http://localhost:5000/textures/wood.jpg',
  marble: 'http://localhost:5000/textures/marble.jpg'
};
const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await fetch('http://localhost:5000/api/upload-texture', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    alert(`✅ Uploaded image. Detected color: ${data.color}`);
    // ✅ Inject uploaded texture into <a-assets>
    const assetContainer = document.querySelector('a-assets');
    if (assetContainer) {
      const img = document.createElement('img');
      img.setAttribute('id', data.textureId);
      img.setAttribute('src', `http://localhost:5000/textures/${data.textureId}.jpg`);
      assetContainer.appendChild(img);
    }

    // Save design using extracted color and texture name
    await fetch('http://localhost:5000/api/save-design', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'My Custom Theme',
        texture: data.textureId, // returned ID
        color: data.color,       // extracted from image
      }),
    });

    // Refresh designs
    const refreshed = await fetch('http://localhost:5000/api/designs');
    const designs = await refreshed.json();
    

    setSavedDesigns(designs);

  } catch (err) {
    console.log('Upload failed:', err);
    alert('❌ Failed to upload image');
  }
   e.target.value = '';
};


  return (
    <div>
      {/* 🎨 Control Buttons */}
      <div style={{ position: 'absolute', zIndex: 10, top: 10, left: 10 }}>
        <input
  type="text"
  placeholder="Enter design title"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  style={{
    marginBottom: '8px',
    padding: '6px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '200px'
  }}
/>
      <button onClick={saveDesign}>💾 Save Design</button>
        <input
    type="file"
    accept="image/*"
    onChange={handleImageUpload}
    style={{
      marginTop: '8px',
      padding: '4px',
      borderRadius: '4px',
      background: '#f0f0f0',
      border: '1px solid #ccc'
      
    }}
  />
    <div
  style={{
    display: 'flex',
    gap: '10px',
    overflowX: 'auto',
    paddingBottom: '10px',
    marginTop: '10px',
    maxWidth: '100vw'
  }}
  
>
  {defaultThemes.map((theme, index) => (
    <div
      key={index}
      onClick={() => applyTheme(theme.texture, theme.color)}
      style={{
        cursor: 'pointer',
        textAlign: 'center',
        border: '1px solid #ccc',
        padding: '6px',
        borderRadius: '8px',
        background: '#f9f9f9',
        minWidth: '100px'
      }}
    >
      <img
        src={theme.thumbnail}
        alt={theme.name}
        style={{
          width: '60px',
          height: '60px',
          objectFit: 'cover',
          borderRadius: '4px'
        }}
      />
      <div style={{ fontSize: '12px', marginTop: '4px' }}>{theme.name}</div>
    </div>
  ))}
</div>
      </div>


      {/* 📦 Saved Designs Box */}
      <div style={{
        background: '#fff',
        padding: '10px',
        marginTop: '160px',
        borderRadius: '8px',
        position: 'absolute',
        top: 100,
        left: 10,
        zIndex: 10,
        maxHeight: '300px',
        overflowY: 'auto'
      }}>
        <h3>Saved Designs</h3>
        {savedDesigns.length === 0 ? (
          <p>No saved designs yet.</p>
        ) : (
          savedDesigns.map((design, index) => (
            <div
              key={index}
              onClick={() => applyTheme(design.texture, design.color)}
              style={{
                marginBottom: '10px',
                cursor: 'pointer',
                padding: '5px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                position: 'relative'
              }}
            >
              {editingId === design._id ? (
  <>
    <input
      value={editedTitle}
      onChange={(e) => setEditedTitle(e.target.value)}
      style={{
        padding: '2px',
        fontSize: '12px',
        width: '120px',
        marginBottom: '4px'
      }}
    />
    <br />
    <button onClick={() => saveTitle(design._id)} style={{ fontSize: '12px', marginRight: '5px' }}>💾 Save</button>
    <button onClick={() => setEditingId(null)} style={{ fontSize: '12px' }}>❌ Cancel</button>
    <br />
  </>
) : (
  <>
    <strong>Title:</strong> {design.title || 'Untitled'}{' '}
    <button
      onClick={(e) => {
        e.stopPropagation();
        setEditingId(design._id);
        setEditedTitle(design.title || '');
      }}
      style={{ fontSize: '12px', marginLeft: '6px' }}
    >
      ✏️ Edit
    </button>
    <br />
  </>
)}

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
  <div
    style={{
      width: '20px',
      height: '20px',
      backgroundColor: design.color,
      border: '1px solid #aaa',
      borderRadius: '4px'
    }}
    title={`Color: ${design.color}`}
  ></div>
  <div>
    {textureImages[design.texture] && (
  <img
  src={`http://localhost:5000/textures/${design.texture}.jpg`}
  alt={design.texture}
  style={{ width: '30px', height: '30px', borderRadius: '4px', objectFit: 'cover' }}
  onError={(e) => { e.target.style.display = 'none'; }} // hide if missing
/>


)}

  </div>
</div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(design._id);
                }}
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  fontSize: '12px'
                }}
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>

      {/* 📷 AR Scene */}
      <div id="ar-root" style={{ width: '100vw', height: '100vh' }}></div>
    </div>
  );
}

export default App;

