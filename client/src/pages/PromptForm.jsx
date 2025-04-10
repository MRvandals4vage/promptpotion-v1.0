import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const PromptForm = () => {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('promptBlocks');
    if (saved) setBlocks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('promptBlocks', JSON.stringify(blocks));
  }, [blocks]);

  const handleAddBlock = (type) => {
    setBlocks([
      ...blocks,
      { id: `${type}-${Date.now()}`, type, content: '' }
    ]);
  };

  const handleChange = (id, value) => {
    setBlocks(blocks.map(b => (b.id === id ? { ...b, content: value } : b)));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newItems = Array.from(blocks);
    const [moved] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, moved);
    setBlocks(newItems);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(blocks)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'prompt.json';
    link.href = url;
    link.click();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setBlocks(JSON.parse(e.target.result));
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Prompt Builder</h2>

      <div className="flex gap-2 mb-4">
        <button className="button" onClick={() => handleAddBlock('text')}>+ Text Block</button>
        <button className="button bg-green-600 hover:bg-green-700" onClick={() => handleAddBlock('instruction')}>+ Instruction Block</button>
        <button className="button bg-yellow-600 hover:bg-yellow-700" onClick={handleExport}>Export</button>
        <label className="button bg-indigo-600 hover:bg-indigo-700 cursor-pointer">
          Import
          <input type="file" className="hidden" onChange={handleImport} />
        </label>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="promptList">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {blocks.map((block, index) => (
                <Draggable key={block.id} draggableId={block.id} index={index}>
                  {(provided) => (
                    <div
                      className="mb-4 p-4 border border-gray-300 rounded-md bg-white"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <label className="font-semibold">{block.type.toUpperCase()}</label>
                      <textarea
                        value={block.content}
                        onChange={(e) => handleChange(block.id, e.target.value)}
                        className="w-full border p-2 rounded-md mt-1"
                        rows={2}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="mt-6">
        <h3 className="text-xl font-bold">Generated Prompt</h3>
        <div className="bg-gray-100 p-4 rounded-md mt-2">
          {blocks.map((block) => (
            <p key={block.id}>{block.content}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromptForm;
