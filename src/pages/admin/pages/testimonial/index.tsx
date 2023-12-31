import { Grid, TextField, Button, TableContainer, Paper, TableHead, TableRow, Box, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { log } from "console";
import { setDoc, doc, getFirestore, collection, getDocs, deleteDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { FunctionComponent, useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import { Table, TableBody, TableCell as MuiTableCell } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AdminSidebar from "@/components/admin/navBar/adminsidebar";
import DeleteIcon from '@mui/icons-material/Delete';
import Link from "next/link";

interface addTestimonialProps {

}

interface Video {
    title: string;
    videourl: string;
}

const AddTestimonial: FunctionComponent<addTestimonialProps> = () => {
    const [title, settitle] = useState("");
    const [video, setvideo] = useState(null as File | null);
    const [videolocalurl, setvideolocalurl] = useState("");
    const [filtered, setFiltered] = useState<Video[]>([]);
    const [videos, setvideos] = useState<Video[]>([]);
    const [open, setopen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
    const [newTitle, setNewTitle] = useState("");
    const [newVideo, setNewVideo] = useState<File | null>(null);
    const [newVideolocalurl, setNewVideolocalurl] = useState("");

    const postdata = async () => {
        const storage = getStorage();
        const storageRef = ref(storage, `testimonials/${title}`);

        const snapshot = await uploadBytes(storageRef, video!)
        const vidurl = await getDownloadURL(snapshot.ref);
        await setDoc(doc(getFirestore(), "testimonials", title), {
            title: title, videourl: vidurl
        })
        handleClose();
        getData();
    }

    const StyledHeaderCell = styled(MuiTableCell)(({ theme }) => ({
        fontWeight: 'bold',
        backgroundColor: '#E2E8EC',
        color: '#6E94AF'
    }));

    const StyledBodyCell = styled(MuiTableCell)({
        color: '#6E94AF',
        fontweight: 'bold'
    });

    const searchChange = (query: string) => {
        const newFiltered = videos.filter(video =>
            video.title.toLowerCase().includes(query.toLowerCase())
        );
        setFiltered(newFiltered);
    };

    const getData = async () => {
        const querySnapshot = await getDocs(collection(getFirestore(), "testimonials"));
        const videos: Video[] = querySnapshot.docs.map(doc => ({ ...doc.data() } as Video));
        setvideos(videos);
        setFiltered(videos);
    }

    const handleClickOpen = () => {
        setopen(true);
    };
    const handleClose = () => {
        setopen(false);
    };
    const handledelete = async (title: string) => {
        const docRef = doc(getFirestore(), "testimonials", title);
        await deleteDoc(docRef);
        console.log(docRef);

        getData();
    }
    const handleDialogOpen = (video: Video) => {
        setCurrentVideo(video);
        setNewTitle(video.title);
        setNewVideo(null);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setCurrentVideo(null);
        setNewTitle("");
        setNewVideo(null);
        setNewVideolocalurl("");
    };


    const handleUpdate = async (newTitle: string, newVideo: File | null) => {
        if (newTitle !== currentVideo!.title) {
            const oldDocRef = doc(getFirestore(), "testimonials", currentVideo!.title);
            await deleteDoc(oldDocRef);
        }

        const docRef = doc(getFirestore(), "testimonials", newTitle);

        if (newVideo) {
            const storage = getStorage();
            const storageRef = ref(storage, `testimonials/${newTitle}`);
            const snapshot = await uploadBytes(storageRef, newVideo);
            const vidurl = await getDownloadURL(snapshot.ref);

            await setDoc(docRef, { title: newTitle, videourl: vidurl });
        } else {
            await setDoc(docRef, { title: newTitle, videourl: currentVideo!.videourl });
        }

        setNewVideolocalurl("");
        handleDialogClose();
        getData();
    };

    useEffect(() => {
        setTimeout(() => {
            getData();
        }, 100);
    }, []);


    return (<>
        <div style={{ paddingLeft: "0px", backgroundColor: "#EBEEF0", minHeight: "100vh" }}>
            {/* Header */}
            <div style={{ backgroundColor: "#EDF6FF", padding: "50px" }}>
                <h2 style={{ margin: 0, paddingBottom: "20px", color: "#6E94AF" }}>Testimonials</h2>
                <p style={{ margin: 0, color: "#000000" }}>Pages {'>'}
                    <a href={`/testimonial`} style={{ color: "#0093FF", textDecoration: "underline" }}>
                        Testimonials
                    </a>
                </p>
            </div>

            <Grid container spacing={2} style={{ backgroundColor: "#EBEEF0" }}>
                <Grid item xs={12} xl={9} style={{ paddingLeft: "30px" }}>

                    <div style={{ color: "#6E94AF", marginBottom: "10px", marginTop: "20px" }}>Content</div>
                    <div style={{ backgroundColor: "#FFFFFF", padding: '50px', borderRadius: '4px', width: "100%" }}>
                        {/* Filter */}
                        <TextField
                            label="Filter by title"
                            variant="outlined"
                            onChange={(e) => searchChange(e.target.value)}
                            fullWidth
                            style={{ margin: "20px 0", backgroundColor: "#FFFFFF", paddingTop: "0px" }}
                        />

                        {/* Table */}
                        <TableContainer component={Paper} sx={{ border: '1px solid #e0e0e0', borderRadius: 4 }}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <StyledHeaderCell>No.</StyledHeaderCell>
                                        <StyledHeaderCell>Title</StyledHeaderCell>
                                        <StyledHeaderCell>Delete</StyledHeaderCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filtered.map((video, index) => (
                                        <TableRow
                                            key={video.title}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <StyledBodyCell style={{ width: '10%' }}>{index + 1}</StyledBodyCell>
                                            <StyledBodyCell style={{ width: '50%' }} component="th" scope="row" onClick={() => handleDialogOpen(video)}>
                                                {video.title}
                                            </StyledBodyCell>
                                            <StyledBodyCell style={{ width: '10%' }}><Button style={{ textAlign: 'center' }}><DeleteIcon onClick={() => handledelete(video.title)}></DeleteIcon></Button></StyledBodyCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box
                            display="flex"
                            justifyContent="center"
                            style={{ margin: "20px 0" }}
                        >
                            <Button variant="contained" onClick={handleClickOpen} style={{ backgroundColor: "#86A7D3" }}>
                                Add
                            </Button>
                        </Box>
                    </div>

                </Grid>

                {/* Save Button */}
                <Grid item xs={12} xl={3} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', paddingRight: '30px' }}>

                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>Add new video</DialogTitle>
                        <DialogContent>
                            Title:
                            <TextField
                                fullWidth
                                id="outlined-basic"
                                variant="outlined"
                                style={{ backgroundColor: "#FFFFFF", paddingBottom: "10px" }}
                                onChange={(e) => settitle(e.target.value)}
                            />
                            <Button style={{ margin: '0 0 10px 0', color: "#000000" }} variant="outlined" component="label">
                                Upload Video
                                <input
                                    hidden
                                    accept="video/*"
                                    type="file"
                                    onChange={(e) => {
                                        setvideo(e.target.files![0]);
                                        setvideolocalurl(URL.createObjectURL(e.target.files![0]));
                                    }}
                                />
                            </Button>
                            <video controls src={videolocalurl} style={{ width: "100%", height: "100%" }} />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={postdata} color="primary">
                                Add
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={dialogOpen} onClose={handleDialogClose}>
                        <DialogTitle>Edit Video</DialogTitle>
                        <DialogContent>
                            <TextField
                                label="Title"
                                fullWidth
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                            />

                            <Button variant="contained" component="label">
                                Upload Video
                                <input
                                    hidden
                                    accept="video/*"
                                    type="file"
                                    onChange={(e) => {
                                        setNewVideo(e.target.files![0]);
                                        setNewVideolocalurl(URL.createObjectURL(e.target.files![0]));
                                    }}
                                />
                            </Button>

                            {newVideo !== null ? (
                                <video controls src={newVideolocalurl} style={{ width: "100%", height: "100%" }} />
                            ) : (
                                <video controls src={currentVideo?.videourl} style={{ width: "100%", height: "100%" }} />
                            )}

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDialogClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={() => handleUpdate(newTitle, newVideo)} color="primary">
                                Update
                            </Button>
                        </DialogActions>
                    </Dialog>

                </Grid>
            </Grid>
        </div >
    </>);
}

export default AddTestimonial;