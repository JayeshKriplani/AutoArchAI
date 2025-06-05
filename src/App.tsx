import { ThemeProvider, createTheme, CssBaseline, Box, Paper, Typography, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import ReactFlow, { Background, Controls, Edge, Node, NodeChange, EdgeChange, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import 'reactflow/dist/style.css';
import { useState, useCallback } from 'react';
import { DragEvent } from 'react';
import CustomNode from './CustomNode';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7B68EE', // Medium slate blue
    },
    background: {
      default: '#0F0F1A', // Darker background
      paper: '#1A1A2E', // Slightly lighter for contrast
    },
  },
});

const nodeTypes = [
  { type: 'file', label: 'File', icon: '📁' },
  { type: 'parser', label: 'Parser', icon: '{}' },
  { type: 'prompt', label: 'Prompt', icon: '📝' },
  { type: 'openai', label: 'OpenAI', icon: '🧠' },
  { type: 'chatinput', label: 'Chat Input', icon: '💬' },
  { type: 'chatoutput', label: 'Chat Output', icon: '💬' },
];

const nodeTemplates: Record<string, any> = {
  file: {
    title: 'File',
    description: 'Load a file to be used in your project.',
    button: 'Select files',
    fields: [
      { label: 'Files', value: '', placeholder: '', readOnly: true },
    ],
    divider: true,
  },
  parser: {
    title: 'Parser',
    description: 'Format a DataFrame or Data object into text using a template. Enable "Stringify" to convert into a readable string instead.',
    fields: [
      { label: 'Mode', value: 'Parser', placeholder: '', readOnly: true },
      { label: 'Template*', value: 'Text: {text}', placeholder: 'Text: {text}', readOnly: false },
      { label: 'Data or DataFrame*', value: '', placeholder: '', readOnly: false },
    ],
    divider: true,
  },
  prompt: {
    title: 'Prompt',
    description: 'Create a prompt template with dynamic variables.',
    fields: [
      { label: 'Template', value: "Answer user's questions based on the document below:\n---\n{Document}", placeholder: '', readOnly: false },
      { label: 'Document', value: '', placeholder: 'Receiving input', readOnly: true },
    ],
    divider: true,
  },
  openai: {
    title: 'OpenAI',
    description: 'Generates text using OpenAI LLMs.',
    fields: [
      { label: 'Input', value: '', placeholder: 'Receiving input', readOnly: true },
      { label: 'System Message', value: '', placeholder: 'Receiving input', readOnly: true },
      { label: 'Model Name', value: 'gpt-4o-mini', placeholder: '', readOnly: false },
      { label: 'OpenAI API Key*', value: '', placeholder: '', readOnly: false },
    ],
    divider: true,
  },
  chatoutput: {
    title: 'Chat Output',
    description: 'Display a chat message in the Playground.',
    fields: [
      { label: 'Text*', value: '', placeholder: 'Receiving input', readOnly: true },
    ],
    divider: true,
  },
  chatinput: {
    title: 'Chat Input',
    description: 'Get chat inputs from the Playground.',
    fields: [
      { label: 'Text', value: 'What is this document is about?', placeholder: '', readOnly: false },
    ],
    divider: true,
  },
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'file',
    position: { x: 0, y: 100 },
    data: nodeTemplates.file,
  },
  {
    id: '2',
    type: 'parser',
    position: { x: 300, y: 40 },
    data: nodeTemplates.parser,
  },
  {
    id: '3',
    type: 'prompt',
    position: { x: 600, y: 60 },
    data: nodeTemplates.prompt,
  },
  {
    id: '4',
    type: 'openai',
    position: { x: 900, y: 80 },
    data: nodeTemplates.openai,
  },
  {
    id: '5',
    type: 'chatoutput',
    position: { x: 1200, y: 120 },
    data: nodeTemplates.chatoutput,
  },
  {
    id: '6',
    type: 'chatinput',
    position: { x: 300, y: 300 },
    data: nodeTemplates.chatinput,
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', sourceHandle: null, targetHandle: null, type: 'default' },
  { id: 'e2-3', source: '2', target: '3', sourceHandle: null, targetHandle: null, type: 'default' },
  { id: 'e3-4', source: '3', target: '4', sourceHandle: null, targetHandle: null, type: 'default' },
  { id: 'e4-5', source: '4', target: '5', sourceHandle: null, targetHandle: null, type: 'default' },
  { id: 'e6-3', source: '6', target: '3', sourceHandle: null, targetHandle: null, type: 'default' },
];

const nodeTypesMap = {
  file: CustomNode,
  parser: CustomNode,
  prompt: CustomNode,
  openai: CustomNode,
  chatinput: CustomNode,
  chatoutput: CustomNode,
};

function App() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type || !nodeTemplates[type]) return;

      const position = {
        x: event.clientX - 250,
        y: event.clientY - 100,
      };

      const newNode: Node = {
        id: `${nodes.length + 1}`,
        type,
        position,
        data: { ...nodeTemplates[type] },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes]
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0F0F1A 0%, #1A1A2E 100%)',
          display: 'flex',
        }}
      >
        {/* Sidebar */}
        <Paper
          elevation={0}
          sx={{
            width: 250,
            background: 'rgba(15, 15, 26, 0.95)',
            borderRight: '1px solid rgba(123, 104, 238, 0.2)',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#7B68EE',
              mb: 2,
              fontSize: '1.1rem',
              fontWeight: 500,
              letterSpacing: '0.5px'
            }}
          >
            Node Types
          </Typography>
          <List>
            {nodeTypes.map((node) => (
              <ListItem
                key={node.type}
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.setData('application/reactflow', node.type);
                  event.dataTransfer.effectAllowed = 'move';
                }}
                sx={{
                  cursor: 'grab',
                  mb: 1,
                  borderRadius: '6px',
                  border: '1px solid rgba(123, 104, 238, 0.2)',
                  background: 'rgba(26, 26, 46, 0.5)',
                  '&:hover': {
                    background: 'rgba(123, 104, 238, 0.1)',
                    border: '1px solid rgba(123, 104, 238, 0.4)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: '#7B68EE', minWidth: 40 }}>{node.icon}</ListItemIcon>
                <ListItemText 
                  primary={node.label} 
                  sx={{ 
                    '& .MuiTypography-root': { 
                      fontSize: '0.9rem',
                      color: 'rgba(255, 255, 255, 0.9)'
                    } 
                  }} 
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Main Flow Area */}
        <Box 
          sx={{ 
            flexGrow: 1, 
            height: '100vh',
            '& .react-flow__node': {
              background: 'rgba(26, 26, 46, 0.8)',
              border: '1px solid rgba(123, 104, 238, 0.3)',
              borderRadius: '8px',
              padding: '10px',
              boxShadow: '0 4px 20px rgba(123, 104, 238, 0.1)',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease',
              '&:hover': {
                boxShadow: '0 6px 24px rgba(123, 104, 238, 0.15)',
                border: '1px solid rgba(123, 104, 238, 0.5)',
              },
            },
            '& .react-flow__edge': {
              stroke: 'rgba(123, 104, 238, 0.5)',
              strokeWidth: 2,
            },
            '& .react-flow__controls': {
              background: 'rgba(15, 15, 26, 0.95)',
              border: '1px solid rgba(123, 104, 238, 0.2)',
              borderRadius: '6px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            },
            '& .react-flow__controls-button': {
              background: 'rgba(26, 26, 46, 0.5)',
              border: '1px solid rgba(123, 104, 238, 0.2)',
              color: 'rgba(123, 104, 238, 0.8)',
              '&:hover': {
                background: 'rgba(123, 104, 238, 0.1)',
              },
            },
          }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onDragOver={onDragOver}
            onDrop={onDrop}
            fitView
            nodeTypes={nodeTypesMap}
            style={{
              background: 'transparent',
            }}
          >
            <Background 
              color="rgba(123, 104, 238, 0.1)"
              gap={24}
              size={1}
              style={{ opacity: 0.2 }}
            />
            <Controls />
          </ReactFlow>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App; 