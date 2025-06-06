"use client";
import { use, useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('https://backend-glist-production.up.railway.app');

export default function Home() {
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);

  useEffect(() => {
    fetch('https://backend-glist-production.up.railway.app/api/groceries')
      .then(res => res.json())
      .then(setItems)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const handleUpdate = (updatedItem) => {
      setItems(prev => prev.map(item => item._id === updatedItem._id ? updatedItem : item));
    };

    const handleAdd = (addedItem) => {
      setItems(prev => [...prev, addedItem]);
    };

    const handleDelete = (deletedItem) => {
      setItems(prev => prev.filter(item => item._id !== deletedItem._id));
    };

    socket.on('item-updated', handleUpdate);
    socket.on('item-added', handleAdd);
    socket.on('item-deleted', handleDelete);

    return () => {
      socket.off('item-updated', handleUpdate);
      socket.off('item-added', handleAdd);
      socket.off('item-deleted', handleDelete);
    };
  }, []);

  const toggleItem = async (item) => {
    const updated = { ...item, inCart: !item.inCart };
    await fetch(`https://backend-glist-production.up.railway.app/api/groceries/${item._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
  };

  const addItem = async () => {
    if (!newItemName.trim()) return;

    await fetch(`https://backend-glist-production.up.railway.app/api/groceries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newItemName, quantity: newItemQuantity })
    });

    setNewItemName('');
    setNewItemQuantity(1);
  };

  const deleteItem = async (item) => {
    await fetch(`https://backend-glist-production.up.railway.app/api/groceries/${item._id}`, {
      method: 'DELETE',
    });
  };

  return (
    <div>
      <h1>Lista de Compras 🛒</h1>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Novo item"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
        />
        <input
          type="number"
          placeholder="Qtd"
          value={newItemQuantity}
          min={1}
          onChange={(e) => setNewItemQuantity(Number(e.target.value))}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
          style={{ width: '60px' }}
        />
        <button onClick={addItem}>Adicionar</button>
      </div>
      <ul>
        {items.map(item => (
          <li
            key={item._id}
            style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span>
              {item.name} 
    
              <input 
                type='checkbox' 
                checked={item.inCart} 
                onChange={() => toggleItem(item)}>
              </input> 
            </span>
            <button onClick={() => deleteItem(item)} style={{ marginLeft: 10 }}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
