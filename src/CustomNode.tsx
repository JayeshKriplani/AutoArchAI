import { Box, Typography, TextField, Button, Divider } from '@mui/material';
import { Handle, Position, NodeProps } from 'reactflow';

const nodeColors: Record<string, string> = {
  file: 'linear-gradient(135deg, #23233b 0%, #2d1a3a 100%)',
  parser: 'linear-gradient(135deg, #23233b 0%, #1a1a2e 100%)',
  prompt: 'linear-gradient(135deg, #23233b 0%, #2d1a3a 100%)',
  openai: 'linear-gradient(135deg, #23233b 0%, #1a1a2e 100%)',
  chatinput: 'linear-gradient(135deg, #23233b 0%, #2d1a3a 100%)',
  chatoutput: 'linear-gradient(135deg, #23233b 0%, #1a1a2e 100%)',
  default: 'linear-gradient(135deg, #23233b 0%, #1a1a2e 100%)',
};

const nodeIcons: Record<string, string> = {
  file: '📁',
  parser: '{}',
  prompt: '📝',
  openai: '🧠',
  chatinput: '💬',
  chatoutput: '💬',
  default: '⚙️',
};

export default function CustomNode({ data, type, id }: NodeProps) {
  const color = nodeColors[type || 'default'] || nodeColors.default;
  const icon = nodeIcons[type || 'default'] || nodeIcons.default;

  return (
    <Box
      sx={{
        minWidth: 260,
        maxWidth: 320,
        background: color,
        borderRadius: '16px',
        boxShadow: '0 4px 24px 0 rgba(123,104,238,0.10)',
        border: '1.5px solid rgba(123,104,238,0.18)',
        p: 2.5,
        color: '#fff',
        fontFamily: 'Inter, sans-serif',
        position: 'relative',
      }}
    >
      {/* Handles */}
      <Handle type="target" position={Position.Left} style={{ background: '#a084e8', width: 10, height: 10, borderRadius: 6, left: -7 }} />
      <Handle type="source" position={Position.Right} style={{ background: '#a084e8', width: 10, height: 10, borderRadius: 6, right: -7 }} />

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Box sx={{ fontSize: 22, mr: 1 }}>{icon}</Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#a084e8', letterSpacing: 0.2 }}>
          {data.title || type.charAt(0).toUpperCase() + type.slice(1)}
        </Typography>
      </Box>
      {/* Description */}
      {data.description && (
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1, fontSize: 13 }}>
          {data.description}
        </Typography>
      )}
      {/* Fields (example) */}
      {data.fields && data.fields.map((field: any, idx: number) => (
        <Box key={idx} sx={{ mb: 1 }}>
          <Typography variant="caption" sx={{ color: '#a084e8', fontWeight: 500 }}>
            {field.label}
          </Typography>
          <TextField
            size="small"
            fullWidth
            variant="outlined"
            value={field.value}
            placeholder={field.placeholder}
            sx={{
              mt: 0.5,
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 1,
              input: { color: '#fff', fontSize: 13 },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(123,104,238,0.18)',
              },
            }}
            InputProps={{
              readOnly: field.readOnly,
            }}
          />
        </Box>
      ))}
      {/* Action Button (example) */}
      {data.button && (
        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 1,
            background: 'linear-gradient(90deg, #a084e8 0%, #7B68EE 100%)',
            color: '#fff',
            fontWeight: 600,
            borderRadius: 2,
            boxShadow: 'none',
            textTransform: 'none',
            fontSize: 14,
            '&:hover': {
              background: 'linear-gradient(90deg, #7B68EE 0%, #a084e8 100%)',
            },
          }}
        >
          {data.button}
        </Button>
      )}
      {/* Divider for sections */}
      {data.divider && <Divider sx={{ my: 1, borderColor: 'rgba(123,104,238,0.18)' }} />}
    </Box>
  );
} 