import React, { useState, useEffect } from 'react';
import { Card } from '../../types';

export function EditCardModal({ card, isOpen, onClose, onSave }: {
  card: Card | null,
  isOpen: boolean,
  onClose: () => void,
  onSave: (updatedCard: Card) => void
}) {
  const [form, setForm] = useState<Card | null>(card);

  useEffect(() => {
    setForm(card);
  }, [card]);

  if (!isOpen || !form) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => prev ? { ...prev, [name]: name === 'impact' ? Number(value) : value } : prev);
  };

  const handleSave = () => {
    if (form) {
      onSave(form);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Card</h2>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-2 border px-2 py-1 rounded"
          placeholder="Name"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full mb-2 border px-2 py-1 rounded"
          placeholder="Description"
        />
        <input
          name="impact"
          type="number"
          value={form.impact}
          onChange={handleChange}
          className="w-full mb-2 border px-2 py-1 rounded"
          placeholder="Impact (XP)"
        />
        {/* Add more fields as needed */}
        <div className="flex gap-2 mt-4">
          <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
} 