import Image from "next/image";

export default function Footer() {
    return (
        <div className="bg-white h-14 flex justify-between px-4">
            <div className="text-blue-900 font-bold my-auto text-xs">
                <p>Projeto de fim de curso</p>
                <p>Aluno: João Pedro Vilela Fonseca</p>
                <p>Orientador: Prof. Dr. João Rodrigo Andrade</p>
            </div>
            <div className="h-12 w-[8.3125rem] my-auto relative">
                <Image src="/femec.png" layout="fill" />
            </div>
            <div className="h-12 w-40 my-auto relative">
                <Image src="/UFU.jpg" layout="fill" />
            </div>
        </div>
    );
}
