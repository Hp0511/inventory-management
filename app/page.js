'use client'
import Image from 'next/image';
import "./page.css";
import { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { Box, Button, Typography, TextField, Container } from '@mui/material';
import { collection, getDocs, query, setDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';

export default function Page() {
  const [inventory, setInventory] = useState([]);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [editState, setEditState] = useState({
    itemId: null,
    name: '',
    quantity: 0
  });

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    console.log(inventoryList)
    docs.forEach(doc => {
      inventoryList.push({
        ...doc.data(),
        id: doc.id
      })
    });
    setInventory(inventoryList);
  }

  useEffect(() => {
    updateInventory();
  }, [])

  const addItem = async (itemID) => {
    const newItemRef = doc(collection(firestore, "inventory"), itemID);
    setInventory(prevInventory => [
      ...prevInventory, 
      { name: itemName, quantity: quantity, id: itemID }
    ]);
    setItemName("");
    setQuantity(1);
    await setDoc(newItemRef, { name: itemName, quantity: quantity, id: itemID });
  };

  const handleAddItem = (event) => {
    event.preventDefault();
    addItem(uuidv4());
  }

  const handleInputChange = (event) => {
    setItemName(event.target.value);
  }

  const handleStartQuantityChange = (event) => {
    const newQuantity = event.target.value;
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      setQuantity(newQuantity);
    }
  };

  const removeItem = async(itemID) => {
    const delItemRef = doc(collection(firestore, "inventory"), itemID);
    setInventory(prevInventory => prevInventory.filter(item => item.id !== itemID ));
    await deleteDoc(delItemRef);
  }

  const handleDoubleClickItem = (item) => {
    setEditState({
      itemId: item.id,
      name: item.name,
      quantity: item.quantity
    });
  }

  const handleNameChange = (event) => {
    setEditState(prev => ({ ...prev, name: event.target.value }));
  };

  const handleQuantityChange = (event) => {
    setEditState(prev => ({ ...prev, quantity: event.target.value }));
  };

  const saveChanges = async (event) => {
    if (event.key === 'Enter' || event.type === 'blur') {
      const { itemId, name, quantity } = editState;
      const editItemRef = doc(collection(firestore, "inventory"), itemId);
      try {
        setInventory(prev => prev.map(item => item.id === itemId ? { ...item, name, quantity } : item));
        await updateDoc(editItemRef, { name, quantity });
        setEditState({ itemId: null, name: '', quantity: 1 }); 
      } catch (error) {
        console.error("Failed to update item:", error);
      }
    }
  };

  return (
    <div className='backgroundImage'>
    <Container sx={{
      display: "flex",
      flexDirection: "column"
    }}>
      <Box 
        component="form" 
        onSubmit={handleAddItem} 
        noValidate 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: 2, 
          width: '100%',
          mt: 4,
          ml: 3
        }}>
        <TextField
            margin="normal"
            sx={{ width: '50vw' }} 
            placeholder='Enter your item'
            value={itemName}
            onChange={handleInputChange}
            variant="outlined"
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              margin="normal"
              type="number"
              sx={{ width: '5vw' }} 
              placeholder="1"
              value={quantity}
              onChange={handleStartQuantityChange}
              variant="outlined"
            />
        </Box>
        <Button
            type="submit"
            sx={{ width: '6vw', height: '5vh', color: 'white' }} 
            variant="outlined"
          >
         Add
        </Button>

      </Box>
      
      <div className='scrollable-table' >
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th></th>
            </tr>
          </thead>
          
          <tbody>
          {inventory.map((item) => (
            <tr key={item.id}>
              <td onDoubleClick={() => handleDoubleClickItem(item)}>
                {editState.itemId === item.id ? (
                  <TextField
                    type="text"
                    placeholder="new name"
                    value={editState.name}
                    onChange={handleNameChange}
                    onBlur={saveChanges}
                    onKeyDown={saveChanges}
                    variant="standard"
                    fullWidth
                    sx={{
                      textAlign: 'center',
                      '& .MuiInputBase-input': {
                        textAlign: 'center' 
                      }
                    }}
                  />
                ) : (
                  item.name
                )}
              </td>
              <td onDoubleClick={() => handleDoubleClickItem(item)}>
                {editState.itemId === item.id ? (
                  <TextField
                    type="number"
                    variant="standard"
                    fullWidth
                    placeholder='1'
                    value={editState.quantity}
                    onChange={handleQuantityChange}
                    onBlur={saveChanges}
                    onKeyDown={saveChanges}
                    sx={{
                      width: '100px', 
                      '& .MuiInputBase-input': {
                        textAlign: 'center' 
                      }
                    }}
                  />
                ) : (
                  item.quantity
                )}
              </td>
              <td className="removeBtn">
                <Button 
                  type="button"
                  variant="outlined"
                  onClick={() => removeItem(item.id)}
                  sx={{
                    color: 'white', 
                    ':hover': {
                      color: 'white', 
                      backgroundColor: 'rgba(255, 255, 255, 0.2)'
                    }
                  }}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </Container>
    </div>
  );
}

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
  });
}
