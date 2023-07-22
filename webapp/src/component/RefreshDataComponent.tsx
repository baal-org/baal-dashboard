import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useConfigurationContext } from "../context/Configuration";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

/**
 * SelectorComponent is a functional component that renders a ConfigSelector component and handles the selected option.
 * @function RefreshDataComponent
 * @returns {React.FunctionComponent} - A functional component that renders a ConfigSelector and handles
 * the selected option.
 *
 * @example
 * <RefreshDataComponent />
 *
 * @async
 * @function handleSelect
 * @param {event} SelectChangeEvent - Change event
 * @returns {Promise<Object>} - The data fetched from the endpoint.
 *
 * @see fetchData
 */

export default function RefreshDataComponent() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { refreshInterval, setrRefreshInterval } = useConfigurationContext();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: colors.primary["400"],
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  function handleSelect(event:SelectChangeEvent) {
    setrRefreshInterval(String(event.target.value));   
  }

  const options = [
    { value: 0, label: 'No Update' },
    { value: 1, label: '1 sec' },
    { value: 5, label: '5 sec' },
    { value: 10, label: '10 sec' },
    { value: 30, label: '30 sec' },
    { value: 60, label: '1 min' },
    { value: 120, label: '2 min' },
    { value: 300, label: '5 min' },
  ];

  return (
    <div>
      <Button onClick={handleOpen} color="secondary">
        Select Run
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            color={colors.grey[300]}
          >
            Select a Metric Refresh Interval
          </Typography>
          <Box id="modal-modal-description" sx={{ mt: 2 }}>
            <Select onChange={handleSelect} value={refreshInterval}>
                {options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem >
                ))}
            </Select >
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
