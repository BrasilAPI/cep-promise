interface CEP {
    cep:  string | number,
    state:  string,
    city:  string,
    street:  string,
    neighborhood:  string
}

export default function cep(cep: string | number): Promise<CEP>

