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
    const [alerts, setAlert] = useState('');
    const [boba, setBoba] = useState<'Yes' | 'No'>('No');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // handle image file selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            // create preview url
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // handle form submission
    const handleFormSubmit = async () => {
        if (tableType === 'Products') {
            const formData = new FormData();
            
            // add image file if selected
            if (imageFile) {
                formData.append('image', imageFile);
            }

            // add other form data
            const newItem = { id, name, description, price: parseFloat(price), customizations, boba, alerts };

            // append all form fields to FormData
            Object.entries(newItem).forEach(([key, value]) => {
                formData.append(key, value.toString());
            });

            onSubmit(formData);
        } else {
            // For ingredients, send as JSON
            const newItem = { 
                id, 
                name, 
                quantity: parseInt(stock), 
                supplier: source, 
                expiration 
            };
            onSubmit(newItem);
        }
        onClose();
    };

    return (
        <>
            {showModal && (
                <div className="fixed inset-0 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg w-96 border">
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
                                    {/* image upload section */}
                                    <div className="mb-4">
                                        <label className="block mb-2">Product Image</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="border p-2 w-full rounded"
                                            onChange={handleImageChange}
                                        />
                                        {imagePreview && (
                                            <div className="mt-2">
                                                <img 
                                                    src={imagePreview} 
                                                    alt="Preview" 
                                                    className="w-32 h-32 object-cover rounded"
                                                />
                                            </div>
                                        )}
                                    </div>

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
                                        <label className="block mb-2">Alerts</label>
                                        <input
                                            type="text"
                                            className="border p-2 w-full rounded"
                                            value={alerts}
                                            onChange={(e) => setAlert(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2">Boba</label>
                                        <select
                                            className="border p-2 w-full rounded"
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