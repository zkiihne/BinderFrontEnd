import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';

import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
// import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography'; 
import { blue } from '@material-ui/core/colors';
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { Link } from 'react-router-dom';
const emails = ['username@gmail.com', 'user02@gmail.com'];


export default function SimpleDialog(props) {

 
  
  const { onClose, selectedValue, open, selectedHeight, selectedWidth, uri, width, height, openGlobal, handleGlobalClose, globalClick, mode, removeClick, globalMode } = props;
  var imageheight = selectedHeight
  var imagewidth = selectedWidth
  while((imagewidth > width) || (imageheight > 700)){
    imagewidth = imagewidth*3/4
    imageheight = imageheight*3/4
  }
 
  console.log("junk", imagewidth, imageheight, mode)
  // if(imagewidth > width){
  //   imagewidth = imagewidth*3/4
  //   imageheight = imageheight*3/4
  // }
  // if(imageheight > height){
  //   imagewidth = imagewidth*3/4
  // }
  var useStyles = makeStyles({
    avatar: {
      backgroundColor: blue[100],
      color: blue[600],
    },
    media: {
      align: "center",
      height: imageheight,
      width: imagewidth,
      maxWidth: imagewidth,
    },
  });
  const classes = useStyles();
  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };
  var link = <a href={selectedValue} target="_blank" >{selectedValue}</a>
  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open} maxWidth={imagewidth} align="center">
      <DialogTitle align="left" id="simple-dialog-title">{uri.name}</DialogTitle>
      <CardMedia
          
          className={classes.media}
          image={selectedValue}
          title="Contemplative Reptile"
        />
      <Box justify="center" maxWidth = {imagewidth}>
      <DialogTitle  id="simple-dialog-title">{uri.description}</DialogTitle>
      <Container maxWidth="sm">
      <Box m="auto" m={2}>
      <Button variant="contained" align="center" target="_blank" href={selectedValue}>Image Link</Button>
      
      </Box>
      <Box m="auto" m={2}>
      {(() => {
        
        if(mode === "user"){
          return(
            <div>
              <Box m="auto" m={2}>
      <Button variant="contained" align="center" onClick={globalClick}>Submit to Beacon Binder</Button>
      </Box>
      <Box m="auto" m={2}>
      <Button variant="contained" align="center" onClick={removeClick}>Remove from User Binder</Button>
      </Box>
      </div>)}
      else if(mode === "global"){
        return(
        <div>
        <Button variant="contained" align="center" onClick={globalClick}>Add to User Binder</Button>
        </div>)
      }
      else{
        return(
      <div />)
        }})()}
      <Dialog
        open={openGlobal}
        onClose={handleGlobalClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{globalMode + " from binder!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {uri.name} was {globalMode}
          </DialogContentText>
        </DialogContent>
        
      </Dialog>
      </Box>
      </Container>
      
      
      </Box>
      
    </Dialog>
  );
}
// "https://source.unsplash.com/iecJiKe_RNg/600x799"
SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,

};

// export default function SimpleDialogDemo() {
//   const [open, setOpen] = React.useState(false);
//   const [selectedValue, setSelectedValue] = React.useState(emails[1]);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = (value) => {
//     setOpen(false);
//     setSelectedValue(value);
//   };

//   return (
//     <div>
//       <Typography variant="subtitle1">Selected: {selectedValue}</Typography>
//       <br />
//       <Button variant="outlined" color="primary" onClick={handleClickOpen}>
//         Open simple dialog
//       </Button>
//       <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} />
//     </div>
//   );
// }