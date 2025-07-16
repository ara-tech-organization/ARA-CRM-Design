import React, { useState } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const AddClientModal = ({ onClientAdded }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ companyName: '', industry: '', manager: '' });
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/clients', formData);
      onClientAdded(res.data);
      setSuccessMessage('Client added successfully!');
      setFormData({ companyName: '', industry: '', manager: '' });
      console.log("Created client:", res.data);


      // Automatically hide success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);

      // Close modal after short delay
      setTimeout(() => setOpen(false), 1000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Add Client
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
          </DialogHeader>

          {successMessage && (
            <div className="bg-green-100 text-green-800 p-2 rounded text-sm mb-2">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full p-2 border"
              required
            />
            <input
              type="text"
              placeholder="Industry"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="w-full p-2 border"
              required
            />
            <input
              type="text"
              placeholder="Manager"
              value={formData.manager}
              onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
              className="w-full p-2 border"
              required
            />
            <Button type="submit" className="bg-green-600 hover:bg-green-700">Submit</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddClientModal;
