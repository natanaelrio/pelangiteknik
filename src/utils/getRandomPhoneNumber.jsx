import { GetNumberSalesWA } from "@/controllers/userClient";

export default async function GetRandomPhoneNumber() {
    const phoneNumbers = [
        { name: "Ina", numberWA: "+6287739235740", numberForm: "087739235740" }, // Nomor 2
        { name: "Sifa", numberWA: "+6285938552576", numberForm: "085938552576" }, // Nomor 1
        { name: "Alma", numberWA: "+6285938552586", numberForm: "085938552586" }     // Nomor 3
    ];

    const randomPhone = phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];


    return randomPhone;
}