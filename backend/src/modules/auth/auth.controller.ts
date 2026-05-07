import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';

export class AuthController {
  static register = asyncHandler(async (req: Request, res: Response) => {
    const user = await AuthService.registerUser(req.body);
    res.status(201).json(new ApiResponse(201, user, 'User registered successfully'));
  });

  static login = asyncHandler(async (req: Request, res: Response) => {
    const data = await AuthService.loginUser(req.body);
    res.status(200).json(new ApiResponse(200, data, 'Login successful'));
  });

  static adminLogin = asyncHandler(async (req: Request, res: Response) => {
    const data = await AuthService.adminLogin(req.body);
    res.status(200).json(new ApiResponse(200, data, 'Admin login successful'));
  });
  static sendOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    const data = await AuthService.sendOtp(email);
    res.status(200).json(new ApiResponse(200, data, 'OTP sent'));
  });

  static verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    const data = await AuthService.verifyOtp(email, otp);
    res.status(200).json(new ApiResponse(200, data, 'Login successful'));
  });
}
