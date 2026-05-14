"use client";

import { useState } from "react";

const useFormData = ({
                         minFiles = 0,
                         maxFiles,
                         fdFilesName = "files",
                     }: {
    minFiles?: number;
    maxFiles?: number;
    fdFilesName?: string;
}) => {
    const [formData, setFormData] = useState<FormData>(new FormData());
    const [validFiles, setValidFiles] = useState<boolean>(minFiles === 0);

    const setFilesField = (files: FileList | File[] | null) => {
        const newFd = formData;
        newFd.delete(fdFilesName);

        if (!files) {
            setValidFiles(minFiles === 0);
            setFormData(newFd);
            return;
        }

        const amountFiles = files.length;
        let valid = false;

        if (amountFiles >= minFiles) {
            if (maxFiles) {
                if (amountFiles <= maxFiles) {
                    valid = true;
                    setValidFiles(true);
                } else {
                    valid = false;
                    setValidFiles(false);
                }
            } else {
                valid = true;
                setValidFiles(true);
            }
        } else {
            valid = false;
            setValidFiles(false);
        }

        if (valid && amountFiles > 0) {
            for (let i = 0; i < amountFiles; i++) {
                newFd.append(fdFilesName, files[i]);
            }
        }

        setFormData(newFd);
    };

    const createState = (data: any): FormData => {
        if (typeof data !== "object") {
            return formData;
        }

        const newFd = formData;
        const keys = Object.keys(data);

        if (keys.length > 0) {
            for (let key of keys) {
                newFd.set(key, String(data[key] ?? ""));
            }
        }

        setFormData(newFd);
        return newFd;
    };

    return {
        getFormData: formData,
        setData: createState,
        setFilesField,
        validFiles,
    };
};

export default useFormData;