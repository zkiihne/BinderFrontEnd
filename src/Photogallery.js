import React                from 'react';
import ReactDOM             from 'react-dom';        
import PropTypes            from 'prop-types';
import Gallery from "react-photo-gallery";
import { photos } from "./photos";
import Divider from '@material-ui/core/Divider';
import CardMedia from '@material-ui/core/CardMedia';
import Container from '@material-ui/core/Container';
//import Demo from './demo';
import SimpleDialog from './demo'
// import MasonryImageList from './Masonry'
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Masonry from 'react-mason';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

// const endpoint = "http://localhost:5000/graphql";  
const endpoint = "https://api.beaconbinder.com/graphql";

export default class Photogallery extends React.PureComponent {
    constructor(props){
        super(props);
        this.state = {
            data: null,
            pics: photos,
            currentImage:0, 
            setCurrentImage:0, 
            selectAll:false, 
            setViewerIsOpen:false,
            selectedIndex: 0, 
            addressOwner: "Me",
            loading: false,
            selectedValueGlobal: false,
            currentAddress: "0xb7a06b79f8bf202c91ec31f396f163abc73b26f2",
            loadingFailure: false,
            viewerMode: "global",
            maskAddress: null,
            globalMode: "added",
            new: true,
            faq:false,
        }       
    }


    
    async componentDidMount(){


        









        console.log("here")

        // if (typeof window.ethereum !== 'undefined') {
        //     window.ethereum
        //     .request({
        //         method: 'eth_requestAccounts',
               
        //     })
        //     .then((result) => {
        //         console.log(result[0]);
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     });
            
        //   } 
        
           
        console.log(this.state)
        const data = {
                optPost: 'userToStat0',
                message: 'We make a research of fetch'
            };
        // const endpoint = "http://localhost:5000/graphql";       
        // const endpoint = "http://ec2-18-191-232-219.us-east-2.compute.amazonaws.com/graphql";   
        const setState = this.setState.bind(this);
        // const query = `query {vp(wa: "0xa679c6154b8d4619af9f83f0bf9a13a680e01ecf"){images, address}}`;
        const query = `query {getglobalgallery{images, address, uri}}`;
        // const query = `query {test{images, address, uri}}`;
        let postBody = JSON.stringify({ query });   
        console.log(postBody)
        setState({loading: true})

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { "content-type": "application/json"}, 
            body: postBody
        })
        
        const responsebody = await response.json()
        console.log(responsebody)
        if(responsebody.data.getglobalgallery == null){
            console.log("error")
            setState({currentAddress: "", addressOwner: "You", loading: false, loadingFailure: true, failMessage:"Error getting global gallery", faq:false})
        }
        else{
        const imagearray = responsebody.data.getglobalgallery[0].images
        const address = responsebody.data.getglobalgallery[0].address
        const uri = responsebody.data.getglobalgallery[0].uri
        var uriarray = []
        for (i = 0; i < uri.length; i++) {
            const ur = JSON.parse(uri[i])
            uriarray.push(ur)
        }
        
        var photoarray = []
        var imagesonly = []
        var i;
        for (i = 0; i < imagearray.length; i++) {
            const imagevalues = imagearray[i].split("[")[1].split("]")[0].split(",")
            console.log(imagevalues)
            photoarray.push({"src":imagevalues[0].slice(1, -1), "width": parseInt(imagevalues[2]), "height": parseInt(imagevalues[1])})
            imagesonly.push(imagevalues[0].slice(1, -1))
        }
        //loop over images concatting htme to photos, with width and height 0image 1width 2height
        console.log(photoarray)
        setState({data: address, pics:photoarray, justimages: imagesonly, loading: false, uris: uriarray, loadingFailure: false, faq:false})
        }
    }

    selectPhoto = (event, { photo, index }) => {
        console.log("cringe", index, photo.src)
        // get image from state
        // use index to get other info
        // display in card
        this.setState({setViewerIsOpen: true, selectedIndex: index, selectedValue: photo.src, selectedWidth: photo.width, selectedHeight: photo.height})
        console.log(this.state)
    };

    handleClose = () => {
        console.log("cringtttte")
        // get image from state
        // use index to get other info
        // display in card
        this.setState({setViewerIsOpen: false, selectedIndex: 0})
        
    };

    removeClick= async () => {
        // get image from state
        // use index to get other info
        // display in card

        
        console.log("removing", this.state)
        
        var uri = this.state.uris[this.state.selectedIndex]
        var contractAddress = uri.address
        if(contractAddress == null){
            contractAddress = uri.contract_address
        }
        var tokenId = uri.token_id 
        var maskaddress = this.state.maskAddress
        if (typeof window.ethereum !== 'undefined' && maskaddress == null) {
            await window.ethereum
            .request({
                method: 'eth_requestAccounts',
               
            })
            .then((result) => {
                maskaddress = result[0]
                console.log(typeof maskaddress);
            })
            .catch((error) => {
                console.log(error);
            });
            
          }
        
        if(this.state.viewerMode === "user"){
            console.log("removing from global", maskaddress, contractAddress, tokenId, uri)
            // const endpoint = "http://localhost:5000/graphql";       
            const query = '{removefromusergallery(us: "'+ maskaddress + '", wa: "'+ contractAddress +'" , tkid: "'+ tokenId +'")}';
            let postBody = JSON.stringify({ query });   
            const response = fetch(endpoint, {
                method: 'POST',
                headers: { "content-type": "application/json" },
                body: postBody
            })
        }
        // else if(this.state.viewerMode === "global"){
        //     console.log("save to gallery")
        //     const endpoint = "http://localhost:5000/graphql";       
        //     const query = '{addtousergallery(us: "'+ maskaddress + '", wa: "'+ contractAddress +'" , tkid: '+ tokenId +')}';
        //     let postBody = JSON.stringify({ query });   
        //     const response = fetch(endpoint, {
        //         method: 'POST',
        //         headers: { "content-type": "application/json" },
        //         body: postBody
        //     })
        // }
        this.setState({selectedValueGlobal: true, maskAddress: maskaddress, globalMode:"removed"})
        console.log(this.state)
    };


    selectGlobal= async () => {
        // get image from state
        // use index to get other info
        // display in card

        
        console.log("sst", this.state)
        
        var uri = this.state.uris[this.state.selectedIndex]
        var contractAddress = uri.address
        var tokenId = uri.token_id 
        var maskaddress = this.state.maskAddress
        if (typeof window.ethereum !== 'undefined' && maskaddress == null) {
            await window.ethereum
            .request({
                method: 'eth_requestAccounts',
               
            })
            .then((result) => {
                maskaddress = result[0]
                console.log(typeof maskaddress);
            })
            .catch((error) => {
                console.log(error);
            });
            
          }
        
        if(this.state.viewerMode === "user" || this.state.viewerMode === "mask"){
            console.log("submit to global", contractAddress, tokenId)
            // const endpoint = "http://localhost:5000/graphql";       
            const query = '{addtoglobal(wa: "'+ contractAddress +'" , tkid: "'+ tokenId +'")}';
            let postBody = JSON.stringify({ query });   
            const response = fetch(endpoint, {
                method: 'POST',
                headers: { "content-type": "application/json" },
                body: postBody
            })
        }
        else if(this.state.viewerMode === "global"){
            console.log("save to local", contractAddress, tokenId)
            // const endpoint = "http://localhost:5000/graphql";       
            const query = '{addtousergallery(us: "'+ maskaddress + '", wa: "'+ contractAddress +'" , tkid: "'+ tokenId +'")}';
            console.log(query)
            let postBody = JSON.stringify({ query });   
            const response = fetch(endpoint, {
                method: 'POST',
                headers: { "content-type": "application/json" },
                body: postBody
            })
        }
        this.setState({selectedValueGlobal: true, maskAddress: maskaddress, globalMode: "added", new: ! this.state.new, faq:false})
        console.log(this.state)
    };

    handleGlobalClose = () => {
        console.log("cringtttte")
        // get image from state
        // use index to get other info
        // display in card
        this.setState({selectedValueGlobal: false})
        
    };

    maskClick = async () => {
        
        console.log("nicici")
        var maskaddress = this.state.maskAddress
        if (typeof window.ethereum !== 'undefined' && maskaddress == null) {
            await window.ethereum
            .request({
                method: 'eth_requestAccounts',
               
            })
            .then((result) => {
                maskaddress = result[0]
                console.log(typeof maskaddress);
            })
            .catch((error) => {
                console.log(error);
            });
            
          }
          // const endpoint = "http://localhost:5000/graphql";       
          const setState = this.setState.bind(this);
          setState({ loading: true})
          var query = 'query {vp(wa: "' + maskaddress +  '" ) {images, address, uri}}';
          let postBody = JSON.stringify({ query });   
          console.log(postBody)
          const response = await fetch(endpoint, {
              method: 'POST',
              headers: { "content-type": "application/json" },
              body: postBody
          })
          const responsebody = await response.json()
          console.log(responsebody)
          if(responsebody.data.vp == null){
              console.log("error")
              setState({currentAddress: maskaddress, addressOwner: "You", loading: false, loadingFailure: true, failMessage:"You have no NFTs in your wallet", faq:false})
          }
          else{
          const imagearray = responsebody.data.vp[0].images
          const address = responsebody.data.vp[0].address
          const uri = responsebody.data.vp[0].uri
            var uriarray = []
            for (i = 0; i < uri.length; i++) {
                const ur = JSON.parse(uri[i])
                uriarray.push(ur)
            }
          var photoarray = []
          var imagesonly = []
          var i;
          for (i = 0; i < imagearray.length; i++) {
              const imagevalues = imagearray[i].split("[")[1].split("]")[0].split(",")
              console.log(imagevalues)
              photoarray.push({"src":imagevalues[0].slice(1, -1), "width": parseInt(imagevalues[2]), "height": parseInt(imagevalues[1])})
              imagesonly.push(imagevalues[0].slice(1, -1))
          }
          //loop over images concatting htme to photos, with width and height 0image 1width 2height
          console.log(photoarray)
          if(photoarray.length != 0){
            setState({currentAddress: maskaddress, pics:photoarray, justimages: imagesonly, addressOwner: "You", loading: false, uris: uriarray, loadingFailure: false, viewerMode: "mask", maskAddress: maskaddress, new: ! this.state.new, faq:false})
          }
          else{
              //error message
          }
          window.scrollTo(0, 0)
        }
        
    };

    globalClick = async () => {
       
            
          // const endpoint = "http://localhost:5000/graphql";       
          const setState = this.setState.bind(this);
          setState({ loading: true})
          var query = 'query {getglobalgallery{images, address, address, name, uri}}';
          let postBody = JSON.stringify({ query });   
          console.log(postBody)
          const response = await fetch(endpoint, {
              method: 'POST',
              headers: { "content-type": "application/json" },
              body: postBody
          })
          const responsebody = await response.json()
          if(responsebody.data.getglobalgallery == null){
            console.log("error")
            setState({currentAddress: "", addressOwner: "Global", loading: false, loadingFailure: true})
        }
        else{
          const imagearray = responsebody.data.getglobalgallery[0].images
          const address = responsebody.data.getglobalgallery[0].address
          const name = responsebody.data.getglobalgallery[0].name
          const uri = responsebody.data.getglobalgallery[0].uri
            var uriarray = []
            for (i = 0; i < uri.length; i++) {
                const ur = JSON.parse(uri[i])
                uriarray.push(ur)
            }
          var photoarray = []
          var imagesonly = []
          var i;
          for (i = 0; i < imagearray.length; i++) {
              const imagevalues = imagearray[i].split("[")[1].split("]")[0].split(",")
              console.log(imagevalues)
              photoarray.push({"src":imagevalues[0].slice(1, -1), "width": parseInt(imagevalues[2]), "height": parseInt(imagevalues[1])})
              imagesonly.push(imagevalues[0].slice(1, -1))
          }
          //loop over images concatting htme to photos, with width and height 0image 1width 2height
          console.log(photoarray)
          if(photoarray.length != 0){
            setState({currentAddress: address, pics:photoarray, justimages: imagesonly, addressOwner: name, loading: false, uris: uriarray, loadingFailure: false, viewerMode: "global", new: ! this.state.new, faq:false})
          }
          else{
              //error message
          }
          window.scrollTo(0, 0)
        }
    };
    faqclick = async() => {
        const setState = this.setState.bind(this);
        setState({faq:true})
    }

    randClick = async () => {
        console.log("sst")
            
          // const endpoint = "http://localhost:5000/graphql";       
          const setState = this.setState.bind(this);
          setState({ loading: true})
          // var query = 'query {random{images, address, address, name, uri}}';
          var query = 'query {getlatestgallery{images, address, name, uri}}';
          let postBody = JSON.stringify({ query });   
          console.log(postBody)
          const response = await fetch(endpoint, {
              method: 'POST',
              headers: { "content-type": "application/json" },
              body: postBody
          })
          const responsebody = await response.json()
         
          if(responsebody.data.getlatestgallery == null || responsebody.data.getlatestgallery[0].images.length == 0){
            console.log("error")
            setState({currentAddress: "", addressOwner: "Global", loading: false, loadingFailure: true, failMessage:"Failed to load, no images were returned", faq:false})
        }
        else{
          const imagearray = responsebody.data.getlatestgallery[0].images
          const address = responsebody.data.getlatestgallery[0].address
          const name = responsebody.data.getlatestgallery[0].name
          const uri = responsebody.data.getlatestgallery[0].uri
            var uriarray = []
            for (i = 0; i < uri.length; i++) {
                const ur = JSON.parse(uri[i])
                uriarray.push(ur)
            }
          var photoarray = []
          var imagesonly = []
          var i;
          for (i = 0; i < imagearray.length; i++) {
              const imagevalues = imagearray[i].split("[")[1].split("]")[0].split(",")
              console.log(imagevalues)
              photoarray.push({"src":imagevalues[0].slice(1, -1), "width": parseInt(imagevalues[2]), "height": parseInt(imagevalues[1])})
              imagesonly.push(imagevalues[0].slice(1, -1))
          }
          //loop over images concatting htme to photos, with width and height 0image 1width 2height
          console.log(photoarray)
          if(photoarray.length != 0){
            setState({currentAddress: address, pics:photoarray, justimages: imagesonly, addressOwner: name, loading: false, uris: uriarray, loadingFailure: false, viewerMode: "global", new: ! this.state.new, faq:false})
          }
          else{
              //error message
          }
          window.scrollTo(0, 0)
        }
    };

    userGalleryClick = async () => {
        console.log("gringo")
        var maskaddress = this.state.maskAddress
        if (typeof window.ethereum !== 'undefined' && maskaddress == null) {
            await window.ethereum
            .request({
                method: 'eth_requestAccounts',
               
            })
            .then((result) => {
                maskaddress = result[0]
                console.log(typeof maskaddress);
            })
            .catch((error) => { 
                console.log(error);
            });
        }
        console.log("ree")
          // const endpoint = "http://localhost:5000/graphql";       
          const setState = this.setState.bind(this);
          setState({ loading: true})
          var query = 'query {getusergallery(wa:"'+ maskaddress + '"){images, address, address, name, uri}}';
          let postBody = JSON.stringify({ query });   
          console.log(postBody)
          const response = await fetch(endpoint, {
              method: 'POST',
              headers: { "content-type": "application/json" },
              body: postBody
          })
          const responsebody = await response.json()
          if(responsebody.data.getusergallery == null){
            console.log("error")
            setState({currentAddress: "", addressOwner: "Global", loading: false, loadingFailure: true, failMessage:"Failed to load, no images were returned", faq:false})
        }
        else{
            console.log("g1")
          const imagearray = responsebody.data.getusergallery[0].images
          const address = responsebody.data.getusergallery[0].address
          const name = responsebody.data.getusergallery[0].name
          const uri = responsebody.data.getusergallery[0].uri
          console.log("g2")
            var uriarray = []
            for (i = 0; i < uri.length; i++) {
                const ur = JSON.parse(uri[i])
                uriarray.push(ur)
            }
          var photoarray = []
          var imagesonly = []
          var i;
          for (i = 0; i < imagearray.length; i++) {
              const imagevalues = imagearray[i].split("[")[1].split("]")[0].split(",")
              console.log(imagevalues)
              photoarray.push({"src":imagevalues[0].slice(1, -1), "width": parseInt(imagevalues[2]), "height": parseInt(imagevalues[1])})
              imagesonly.push(imagevalues[0].slice(1, -1))
          }
          //loop over images concatting htme to photos, with width and height 0image 1width 2height
          console.log(photoarray)
          if(photoarray.length != 0){
              console.log("g3")
            setState({currentAddress: address, pics: photoarray, justimages: imagesonly, addressOwner: name, loading: false, uris: uriarray, loadingFailure: false, viewerMode: "user", maskAddress: maskaddress, new: ! this.state.new, faq:false})
          }
          else{
              //error message
          }
          window.scrollTo(0, 0)
        }
    };


    inputenter = async () => {
        console.log("nicici")
        var maskaddress = this.state.currentAddress
        
          // const endpoint = "http://localhost:5000/graphql";       
          const setState = this.setState.bind(this);
          setState({ loading: true})
          var query = 'query {vp(wa: "' + maskaddress +  '" ) {images, address, uri}}';
          let postBody = JSON.stringify({ query });   
          console.log(postBody)
          const response = await fetch(endpoint, {
              method: 'POST',
              headers: { "content-type": "application/json" },
              body: postBody
          })
          const responsebody = await response.json()
          if(responsebody.data.vp == null){
            console.log("error")
            setState({currentAddress: maskaddress, addressOwner: "You", loading: false, loadingFailure: true, failMessage:"Failed to load, no images were returned", faq:false})
        }
        else{
          const imagearray = responsebody.data.vp[0].images
          const address = responsebody.data.vp[0].address
          const uri = responsebody.data.vp[0].uri
        var uriarray = []
        for (i = 0; i < uri.length; i++) {
            const ur = JSON.parse(uri[i])
            uriarray.push(ur)
        }
          var photoarray = []
          var imagesonly = []
          var i;
          for (i = 0; i < imagearray.length; i++) {
              const imagevalues = imagearray[i].split("[")[1].split("]")[0].split(",")
              console.log(imagevalues)
              photoarray.push({"src":imagevalues[0].slice(1, -1), "width": parseInt(imagevalues[2]), "height": parseInt(imagevalues[1])})
              imagesonly.push(imagevalues[0].slice(1, -1))
          }
          //loop over images concatting htme to photos, with width and height 0image 1width 2height
          console.log(photoarray)
          if(photoarray.length != 0){
            setState({currentAddress: maskaddress, pics:photoarray, justimages: imagesonly, addressOwner: "User Input", loading: false, uris: uriarray, loadingFailure: false, faq:false})
          }
          else{
              //error message
          }
        }
        
    };

    
    // {this.state.viewerIsOpen ? <Lightbox images={this.state.justimages} startIndex={this.state.currentImage} onClose={this.closeLightbox} />: null}
    render(){
        console.log(this.state)
        return (<div>
            <AppBar position="sticky">
            <Toolbar>
                <Button color="inherit" onClick={this.globalClick} style={{textTransform: 'none'}} >
                <Typography variant="h5" >
                    Beacon Binder
                </Typography>
                </Button>
          
          <Box m={"auto"} p={1}>
            <Button  color="inherit" onClick={this.randClick} >
                Latest NFTs
                </Button>
                </Box>
            
            <Box m={"auto"} p={1}>
            <Button  color="inherit" onClick={this.userGalleryClick} >
                My Saved Binder
                </Button>
                </Box>
            
                <Box m={"auto"} p={1}>
          <Button color="inherit"  onClick={this.maskClick} >
            My Own Binder
            </Button>
            </Box>
            <Box m={"auto"} p={1}>
          <Button color="inherit"  onClick={this.faqclick} >
            FAQ
            </Button>
            </Box>
        </Toolbar>
        
      </AppBar>
      { this.state.loading ? (
            
            <div style={{display: 'flex', justifyContent: 'left'}}>
                    
                    <LinearProgress color="primary" style={{position: 'fixed', width: "100%"}} />
                   
            </div>
            ): (<div /> )}
      
           
            { this.state.loadingFailure ? (
            
            <div style={{display: 'flex', justifyContent: 'center'}}>
                    <Typography variant="h6" >
            {this.state.failMessage}
          </Typography>
            </div>
            ): (<div /> )}
            <Container maxWidth="lg">
            
            
            {(() => {
                if(! this.state.faq){
            if (! this.state.setViewerIsOpen) {
                if(this.state.new){
                    return (
                    <div>
                        <Masonry />
                        <Gallery photos={this.state.pics} columns={2} direction={"column"} margin={10} onClick={this.selectPhoto} /></div>)
                }
                else{
                return (
                    
                    <div>
                        <Gallery photos={this.state.pics} columns={2} direction={"column"} margin={10} onClick={this.selectPhoto} /></div>
                  
                )
                }
            } else if (this.state.setViewerIsOpen) {
                return (
                
                <div>
                    <Gallery photos={this.state.pics} columns={2} direction={"column"} margin={10}  />
                <SimpleDialog height={window.innerHeight} width={window.innerWidth} uri = {this.state.uris[this.state.selectedIndex]} 
                openGlobal={this.state.selectedValueGlobal} globalMode={this.state.globalMode} handleGlobalClose={this.handleGlobalClose} globalClick={this.selectGlobal}
                selectedWidth={this.state.selectedWidth} selectedHeight={this.state.selectedHeight} 
                selectedValue={this.state.selectedValue} open={this.state.setViewerIsOpen} removeClick={this.removeClick}
                onClick={this.selectPhoto} onClose={this.handleClose} mode={this.state.viewerMode}/></div>
            )
            } else {
                return (
                <div>catch all</div>
            )
        }}
        else{
            return(<div><Typography variant="h6" >
            yolo
      </Typography></div>
            )
        }
    }
    )()}
            </Container>
           
        </div>);
    }
}
