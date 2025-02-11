import axios from "axios";
import { CreatePackageDTO } from "../entities/package.entity";

export const sumWeight = (packages: CreatePackageDTO[]) => {
    return packages.reduce((acc, p) => acc + p.weight, 0)
}

//validar dirección con nominatim de openstreetmap
export const validateAddress = async (address: string) => {
    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${address}&format=json`)
        return response.data.length > 0
    } catch (e) {
        return false
    }
}
