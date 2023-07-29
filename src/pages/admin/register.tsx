import { Button, Input, TextField } from "@mui/material";
import { initializeApp } from "firebase/app";
import { EmailAuthProvider, User, createUserWithEmailAndPassword, deleteUser, getAuth, onAuthStateChanged, reauthenticateWithCredential, updateEmail, updatePassword, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { FunctionComponent, useEffect, useState } from "react";
import { Paper, Typography, Box, Grid } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { log } from "console";

interface RegisterPageProps {

}

const RegisterPage: FunctionComponent<RegisterPageProps> = () => {
    const masterUid = 'R4BgCTEarYMs4Vt0R8OI6lLjFRF3';
    const [user, setuser] = useState(null as User | null);
    const [email, setemail] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [password, setpassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [photoFile, setPhotoFile] = useState(null as File | null);

    useEffect(() => {
        setTimeout(() => {
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                setuser(user);
                console.log(user);
            });
        }, 100);
    }, []);

    const addAdmin = async () => {
        const secondaryFirebaseConfig = {
            apiKey: "AIzaSyA8hfrTnxD1pOUvJO6PchHxmj75A6U--M8",
            authDomain: "orientation-8ca3c.firebaseapp.com",
            databaseURL: "https://orientation-8ca3c-default-rtdb.asia-southeast1.firebasedatabase.app",
            projectId: "orientation-8ca3c",
            storageBucket: "orientation-8ca3c.appspot.com",
            messagingSenderId: "828392869780",
            appId: "1:828392869780:web:8506b4975ce4e3e4ae8981"
        };

        // Initialize Firebase
        const secondaryApp = initializeApp(secondaryFirebaseConfig, 'secondary');
        const secondaryAuth = getAuth(secondaryApp);
        createUserWithEmailAndPassword(secondaryAuth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // ...previous user creation code here

                // Check if a photo file has been uploaded
                if (photoFile) {
                    // Create a storage reference
                    const storage = getStorage(secondaryApp);
                    const storageRef = ref(storage, 'userPhotos/' + photoFile.name);

                    // Upload the file
                    const uploadTask = uploadBytesResumable(storageRef, photoFile);

                    uploadTask.on('state_changed',
                        (snapshot) => {
                            // Optional: Handle progress updates
                        },
                        (error) => {
                            console.error(error);
                        },
                        () => {
                            // Upload completed successfully, get the download URL
                            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                console.log('File available at', downloadURL);

                                // Update user profile with photoURL
                                if (user) {
                                    updateProfile(user, {
                                        displayName: displayName,
                                        photoURL: downloadURL
                                    }).then(() => {
                                        // Profile updated
                                        console.log("User profile updated.");
                                    }).catch((error) => {
                                        // An error occurred
                                        console.error(error);
                                    });
                                }
                            });
                        }
                    );
                }
            })
    }

    return (user && user.uid == masterUid) ?
        <div style={{ paddingLeft: "0px", backgroundColor: "#EBEEF0", minHeight: "100vh" }}>
            {/* Header */}
            <div style={{ backgroundColor: "#EDF6FF", padding: "50px" }}>
                <h2 style={{ margin: 0, paddingBottom: "20px", color: "#6E94AF" }}>Admin panel</h2>
            </div>

            <Grid container spacing={2} style={{ backgroundColor: "#EBEEF0" }}>
                <Grid item xs={12} xl={9} style={{ paddingLeft: "30px" }}>
                    <div style={{ color: "#6E94AF", marginBottom: "10px", marginTop: "20px" }}>Add new admins</div>
                    <div style={{ backgroundColor: "#FFFFFF", padding: '50px', borderRadius: '4px', width: "100%" }}>
                        <div style={{ backgroundColor: "#DCE2EA", borderRadius: '4px', padding: '30px', display: 'flex' }}>
                            <div style={{ flex: 1, marginRight: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <TextField InputProps={{ style: { height: "50px" } }} fullWidth style={{ paddingBottom: '10px', marginBottom: '10px' }} id="email" label="Email" variant="outlined" onChange={(e) => setemail(e.target.value)} />
                                <TextField InputProps={{ style: { height: "50px" } }} fullWidth style={{ paddingBottom: '10px', marginBottom: '10px' }} id="password" label="Password" variant="outlined" onChange={(e) => setpassword(e.target.value)} />
                                <TextField InputProps={{ style: { height: "50px" } }} fullWidth style={{ paddingBottom: '10px', marginBottom: '10px' }} id="displayName" label="Display Name" variant="outlined" onChange={(e) => setDisplayName(e.target.value)} />
                                <Input fullWidth type="file" id="photoFile" onChange={(e) => {
                                    const target = e.target as HTMLInputElement;
                                    const file = target.files ? target.files[0] : null;
                                    setPhotoFile(file);
                                }} />
                                <Button variant="outlined" onClick={addAdmin}>Create Admin</Button>

                            </div>
                        </div>
                    </div>
                </Grid>
            </Grid>

        </div>
        :
        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: 'calc(100vh - 65px)' }}>
            <Paper elevation={2} style={{ padding: '2rem', marginTop: '1rem' }}>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <LockIcon style={{ fontSize: 80, color: 'gray' }} />
                    <Typography variant="h4" component="h2" gutterBottom>
                        Access Denied
                    </Typography>
                    <Typography component="p">
                        You don't have permission to view this page.
                    </Typography>
                </Box>
            </Paper>
        </Grid>;
}

export default RegisterPage;