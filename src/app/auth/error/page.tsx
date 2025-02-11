"use client"
import { useState } from "react";
import DialogBoxError from "~/components/DialogBoxError";


export default function AccessDenied() {
  
  return (
    <DialogBoxError
      title="Login Denied"
      message="You must log in using an email from the std.stei.itb.ac.id organization."
      onConfirm={() => (window.location.href = "/auth/login")}
    />
  );
}
