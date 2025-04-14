import React, { useState } from 'react';

interface Props {
  showModal: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  tableType: 'Ingredients' | 'Products';
}

const NewItemModal: React.FC<Props> = ({ showModal, onClose, onSubmit, tableType }) => {
    const [id, setId] = useState('00000000-0000-0000-0000-000000000000');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [source, setSource] = useState('');
    const [expiration, setExpiration] = useState('');
    const [customizations, setCustomizations] = useState('');
    const [boba, setBoba] = useState<'Yes' | 'No'>('No');

  const handleFormSubmit = () => {
    const newItem = tableType === 'Products'
      ? { id, name, description, price: parseFloat(price), customizations, boba }
      : { id, name, stock: parseInt(stock), source, expiration };

    onSubmit(newItem);
    onClose();
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-700 p-6 rounded shadow-lg w-96 border">
            <h2 className="text-xl mb-4">{tableType === 'Products' ? 'Add New Product' : 'Add New Ingredient'}</h2>
            <form>
            <div className="mb-4">
                <label className="block mb-2">ID</label>
                <input
                  type="text"
                  className="border p-2 w-full rounded"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2">Name</label>
                <input
                  type="text"
                  className="border p-2 w-full rounded"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {tableType === 'Products' ? (
                <>
                  <div className="mb-4">
                    <label className="block mb-2">Description</label>
                    <input
                      type="text"
                      className="border p-2 w-full rounded"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2">Price</label>
                    <input
                      type="number"
                      className="border p-2 w-full rounded"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2">Customizations</label>
                    <input
                      type="text"
                      className="border p-2 w-full rounded"
                      value={customizations}
                      onChange={(e) => setCustomizations(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2">Boba</label>
                    <select
                      className="border p-2 w-full dark:bg-gray-700 rounded"
                      value={boba}
                      onChange={(e) => setBoba(e.target.value as 'Yes' | 'No')}
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block mb-2">Stock</label>
                    <input
                      type="number"
                      className="border p-2 w-full rounded"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2">Source</label>
                    <input
                      type="text"
                      className="border p-2 w-full rounded"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2">Expiration Date</label>
                    <input
                      type="date"
                      className="border p-2 w-full rounded"
                      value={expiration}
                      onChange={(e) => setExpiration(e.target.value)}
                    />
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <button
                  type="button"
                  className="bg-gray-400 text-white p-2 rounded"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="bg-blue-500 text-white p-2 rounded"
                  onClick={handleFormSubmit}
                >
                  {tableType === 'Products' ? 'Add Product' : 'Add Ingredient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default NewItemModal;