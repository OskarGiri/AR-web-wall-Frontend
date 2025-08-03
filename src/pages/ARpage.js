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

const recommendedColors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff"];

function ARpage() {
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [savedDesigns, setSavedDesigns] = useState([]);

  // Load saved designs on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/designs')
      .then(res => res.json())
      .then(data => setSavedDesigns(data))
      .catch(err => console.error('Failed to fetch designs:', err));
  }, []);

  // Insert AR scene
  useEffect(() => {
    const sceneHTML = `
      <a-scene embedded arjs="sourceType: webcam;" renderer="logarithmicDepthBuffer: true;" vr-mode-ui="enabled: false">
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

  // Save design
  const saveDesign = async () => {
    const box = document.querySelector('#paint-box');
    if (!box) return alert('❌ Paint box not found');

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
        body: JSON.stringify({ title, texture, color })
      });

      const result = await response.json();
      alert(`✅ ${result.message}`);

      const newData = await fetch('http://localhost:5000/api/designs');
      setSavedDesigns(await newData.json());
    } catch (err) {
      console.error(err);
      alert('❌ Error saving design');
    }
  };

  // Delete design
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this design?")) return;

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

  // Edit title
  const saveTitle = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/designs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editedTitle }),
      });
      setEditingId(null);
      setEditedTitle('');
      const res = await fetch('http://localhost:5000/api/designs');
      setSavedDesigns(await res.json());
    } catch (err) {
      console.error('Failed to update title:', err);
      alert('❌ Failed to update title');
    }
  };

  // Apply theme
  const applyTheme = (textureId, color) => {
    try {
      const box = document.querySelector('#paint-box');
      if (!box) return;

      const mesh = box.getObject3D('mesh');
      if (!mesh || !mesh.material) return;
      const material = mesh.material;

      const isDefault = ['brick', 'wood', 'marble'].includes(textureId);

      if (!textureId || textureId === 'none') {
        material.map = null;
        material.color.set(color || '#ffffff');
        material.needsUpdate = true;
        return;
      }

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
        });
        return;
      }

      const imgUrl = `http://localhost:5000/textures/${textureId}.jpg`;
      new THREE.TextureLoader().load(
        imgUrl,
        (tex) => {
          tex.generateMipmaps = false;
          tex.minFilter = THREE.LinearFilter;
          tex.magFilter = THREE.LinearFilter;
          material.map = tex;
          material.color.set('#ffffff');
          material.needsUpdate = true;
        },
        undefined,
        () => {
          console.warn(`⚠️ Texture missing, applying color only: ${color}`);
          material.map = null;
          material.color.set(color);
          material.needsUpdate = true;
        }
      );
    } catch (err) {
      console.error('❌ applyTheme crashed:', err);
    }
  };

  // Handle image upload
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

      const assetContainer = document.querySelector('a-assets');
      if (assetContainer) {
        const img = document.createElement('img');
        img.setAttribute('id', data.textureId);
        img.setAttribute('src', `http://localhost:5000/textures/${data.textureId}.jpg`);
        assetContainer.appendChild(img);
      }

      await fetch('http://localhost:5000/api/save-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'My Custom Theme', texture: data.textureId, color: data.color }),
      });

      const refreshed = await fetch('http://localhost:5000/api/designs');
      setSavedDesigns(await refreshed.json());
    } catch (err) {
      console.log('Upload failed:', err);
      alert('❌ Failed to upload image');
    }

    e.target.value = '';
  };

  return (
    <div>
      {/* 🎨 Control Panel */}
      <div style={{ position: 'absolute', zIndex: 10, top: 10, left: 10, background: '#fff', padding: '10px', borderRadius: '8px', width: '220px' }}>
        <input
          type="text"
          placeholder="Enter design title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginBottom: '8px', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
        />
        <button onClick={saveDesign} style={{ marginBottom: '8px', width: '100%' }}>💾 Save Design</button>
        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ marginBottom: '12px', width: '100%' }} />

        {/* Recommended Colors */}
        <h4 style={{ fontSize: '14px', marginBottom: '6px' }}>Recommended Colors</h4>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {recommendedColors.map((color, idx) => (
            <div key={idx} onClick={() => applyTheme('none', color)} style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: color, cursor: 'pointer' }} />
          ))}
        </div>

        {/* Default Themes */}
        {defaultThemes.map((theme, i) => (
          <div key={i} onClick={() => applyTheme(theme.texture, theme.color)} style={{ cursor: 'pointer', textAlign: 'center', border: '1px solid #ccc', padding: '6px', borderRadius: '8px', background: '#f9f9f9', marginBottom: '8px' }}>
            <img src={theme.thumbnail} alt={theme.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', marginBottom: '4px' }} />
            <div style={{ fontSize: '12px' }}>{theme.name}</div>
          </div>
        ))}
      </div>

      {/* Saved Designs */}
      <div style={{ background: '#fff', padding: '10px', position: 'absolute', top: 10, right: 10, zIndex: 10, maxHeight: '300px', overflowY: 'auto', borderRadius: '8px', width: '200px' }}>
        <h3>Saved Designs</h3>
        {savedDesigns.length === 0 ? <p>No saved designs yet.</p> : savedDesigns.map((design, index) => (
          <div key={index} onClick={() => applyTheme(design.texture, design.color)} style={{ marginBottom: '10px', cursor: 'pointer', padding: '5px', border: '1px solid #ddd', borderRadius: '6px', position: 'relative' }}>
            {editingId === design._id ? (
              <>
                <input value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} style={{ padding: '2px', fontSize: '12px', width: '120px', marginBottom: '4px' }} />
                <br />
                <button onClick={() => saveTitle(design._id)} style={{ fontSize: '12px', marginRight: '5px' }}>💾 Save</button>
                <button onClick={() => setEditingId(null)} style={{ fontSize: '12px' }}>❌ Cancel</button>
              </>
            ) : (
              <>
                <strong>{design.title || 'Untitled'}</strong>
                <button onClick={(e) => { e.stopPropagation(); setEditingId(design._id); setEditedTitle(design.title || ''); }} style={{ fontSize: '12px', marginLeft: '6px' }}>✏️ Edit</button>
              </>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: design.color, border: '1px solid #aaa', borderRadius: '4px' }} title={`Color: ${design.color}`} />
              <div>
                <img src={`http://localhost:5000/textures/${design.texture}.jpg`} alt={design.texture} style={{ width: '30px', height: '30px', borderRadius: '4px', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
            </div>

            <button onClick={(e) => { e.stopPropagation(); handleDelete(design._id); }} style={{ position: 'absolute', top: '5px', right: '5px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', padding: '2px 6px', fontSize: '12px' }}>🗑️</button>
          </div>
        ))}
      </div>

      {/* AR Scene */}
      <div id="ar-root" style={{ width: '100vw', height: '100vh' }}></div>
    </div>
  );
}

export default ARpage;
