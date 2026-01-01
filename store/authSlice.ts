import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import authService from '../services/authService';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    token: string;
}

interface AuthState {
    user: User | null;
    isError: boolean;
    isSuccess: boolean;
    isLoading: boolean;
    message: string;
}

const initialState: AuthState = {
    user: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// Register user
export const register = createAsyncThunk(
    'auth/register',
    async (user: any, thunkAPI) => {
        try {
            return await authService.register(user);
        } catch (error: any) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Login user
export const login = createAsyncThunk(
    'auth/login',
    async (user: any, thunkAPI) => {
        try {
            return await authService.login(user);
        } catch (error: any) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
    await authService.logout();
});

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
        setCredentials: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(register.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
            });
    },
});

export const { reset, setCredentials } = authSlice.actions;
export default authSlice.reducer;
