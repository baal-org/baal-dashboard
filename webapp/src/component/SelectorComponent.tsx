import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useConfigurationContext } from "../context/Configuration";

/**
 * SelectorComponent is a functional component that renders a ConfigSelector component and handles the selected option.
 * @function SelectorComponent
 * @returns {React.FunctionComponent} - A functional component that renders a ConfigSelector and handles
 * the selected option.
 *
 * @example
 * <SelectorComponent />
 *
 * @async
 * @function handleSelect
 * @param {Object} selectedOption - An object that holds the selected option value and label.
 * @param {string} selectedOption.value - The selected option value.
 * @param {string} selectedOption.label - The selected option label.
 * @returns {Promise<Object>} - The data fetched from the endpoint.
 *
 * @see ConfigSelector
 * @see fetchData
 */

export default function SelectorComponent() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
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
            Select a configuration
          </Typography>
          <Box id="modal-modal-description" sx={{ mt: 2 }}></Box>
        </Box>
      </Modal>
    </div>
  );
}
