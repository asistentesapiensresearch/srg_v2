// src/view/sections/InstagramFeed/index.jsx
import React, { useMemo, useState, useEffect } from 'react';
import { Box, Container, Typography, Avatar, Button, Grid, Stack, Divider } from '@mui/material';
import { Instagram, Heart, MessageCircle, Grid as GridIcon, Play, UserSquare } from 'lucide-react';
import { getUrl } from 'aws-amplify/storage';

export default function InstagramFeed({
    username = "@usuario",
    profile_picture,
    bio = "",
    posts_count = "0",
    followers_count = "0",
    following_count = "0",
    posts = "[]",
    columns = 3,
    primary_color = "#E1306C",
    show_stats = true
}) {
    const [profileUrl, setProfileUrl] = useState("");
    const [postImages, setPostImages] = useState({});

    // Parsear posts
    const postsList = useMemo(() => {
        try { return JSON.parse(posts); } catch (e) { return []; }
    }, [posts]);

    // Resolver imágenes de S3
    useEffect(() => {
        const resolveImages = async () => {
            // Perfil
            if (profile_picture) {
                const res = await getUrl({ path: profile_picture });
                setProfileUrl(res.url.toString());
            }

            // Posts
            const urls = {};
            for (let i = 0; i < postsList.length; i++) {
                const p = postsList[i];
                if (p.image && !p.image.startsWith('http')) {
                    const res = await getUrl({ path: p.image });
                    urls[i] = res.url.toString();
                } else {
                    urls[i] = p.image;
                }
            }
            setPostImages(urls);
        };
        resolveImages();
    }, [profile_picture, postsList]);

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            {/* HEADER DE PERFIL */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 4, mb: 6, alignItems: 'center' }}>
                <Avatar
                    src={profileUrl}
                    sx={{ width: { xs: 80, sm: 150 }, height: { xs: 80, sm: 150 }, border: '1px solid #dbdbdb', p: 0.5 }}
                />

                <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                        <Typography variant="h5" fontWeight="300">{username.replace('@', '')}</Typography>
                        <Button
                            variant="contained"
                            size="small"
                            sx={{ bgcolor: primary_color, '&:hover': { bgcolor: primary_color, opacity: 0.9 }, textTransform: 'none', fontWeight: 'bold' }}
                        >
                            Seguir
                        </Button>
                    </Stack>

                    {show_stats && (
                        <Stack direction="row" spacing={4} sx={{ mb: 2, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                            <Typography variant="body1"><strong>{posts_count}</strong> publicaciones</Typography>
                            <Typography variant="body1"><strong>{followers_count}</strong> seguidores</Typography>
                            <Typography variant="body1"><strong>{following_count}</strong> seguidos</Typography>
                        </Stack>
                    )}

                    <Typography variant="body2" fontWeight="bold">{username}</Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{bio}</Typography>
                </Box>
            </Box>

            <Divider sx={{ mb: 1 }} />

            {/* TABS SIMULADOS */}
            <Stack direction="row" justifyContent="center" spacing={6} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, borderTop: '1px solid black', mt: '-9px', pt: 1, cursor: 'pointer' }}>
                    <GridIcon size={14} /> <Typography variant="caption" fontWeight="bold">PUBLICACIONES</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', pt: 1, cursor: 'pointer' }}>
                    <Play size={14} /> <Typography variant="caption" fontWeight="bold">REELS</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', pt: 1, cursor: 'pointer' }}>
                    <UserSquare size={14} /> <Typography variant="caption" fontWeight="bold">ETIQUETADAS</Typography>
                </Box>
            </Stack>

            {/* GRID DE POSTS */}
            <Grid container spacing={1}>
                {postsList.map((post, index) => (
                    <Grid item xs={4} key={index}>
                        <Box sx={{
                            position: 'relative',
                            width: '100%',
                            paddingTop: '100%',
                            bgcolor: '#f0f0f0',
                            cursor: 'pointer',
                            '&:hover .overlay': { opacity: 1 }
                        }}>
                            <Box
                                component="img"
                                src={postImages[index] || 'https://via.placeholder.com/300'}
                                sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                            />

                            {/* OVERLAY AL PASAR EL MOUSE */}
                            <Box className="overlay" sx={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                bgcolor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                opacity: 0, transition: 'opacity 0.2s', gap: { xs: 1, sm: 3 }, color: 'white'
                            }}>
                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                    <Heart size={20} fill="white" /> <Typography fontWeight="bold">{post.likes}</Typography>
                                </Stack>
                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                    <MessageCircle size={20} fill="white" /> <Typography fontWeight="bold">{post.comments}</Typography>
                                </Stack>
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}