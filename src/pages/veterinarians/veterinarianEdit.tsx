import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { veterinariansApi } from "../../api/veterinarians";
import {
    Box, Paper, TextField, Button, Typography, CircularProgress, Alert
} from "@mui/material";
import { useState, useEffect } from "react";

export default function VeterinarianEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ["veterinarian", id],
        queryFn: () => veterinariansApi.getById(id!),
    });

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        licenseNumber: "",
        version: 0,
    });

    useEffect(() => {
        if (data) {
            setForm({
                firstName: data.firstName,
                lastName: data.lastName,
                licenseNumber: data.licenseNumber || "",
                version: data.version,
            });
        }
    }, [data]);

    const updateMutation = useMutation({
        mutationFn: () => veterinariansApi.update(id!, form),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["veterinarians"] });
            alert("Veterinarian updated successfully!");
            navigate("/veterinarians");
        },
    });

    if (isLoading) return <CircularProgress />;
    if (error) return <Alert severity="error">Failed to load data.</Alert>;

    return (
        <Box maxWidth={500} mx="auto" mt={4}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" mb={2}>Edit Veterinarian</Typography>

                <TextField
                    fullWidth
                    label="First Name"
                    sx={{ mb: 2 }}
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                />

                <TextField
                    fullWidth
                    label="Last Name"
                    sx={{ mb: 2 }}
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                />
                <Button
                    variant="contained"
                    fullWidth
                    onClick={() => updateMutation.mutate()}
                >
                    Save Changes
                </Button>
            </Paper>
        </Box>
    );
}
