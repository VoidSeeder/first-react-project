import { useEffect, useState } from "react";
import Card from "../../components/Card";

type FluidPropertiesType = {
    inT: number;
    outT: number;
};

export default function Bitubular() {
    const flowDirectionList = ["Paralelo", "Contra-corrente"];

    const [flowDirection, setFlowDirection] = useState("Paralelo");

    const [lmtd, setLmtd] = useState(0);

    const [fluid1, setFluid1] = useState<FluidPropertiesType>({
        inT: 49,
        outT: 43,
    });

    const [fluid2, setFluid2] = useState<FluidPropertiesType>({
        inT: 22,
        outT: 25,
    });

    useEffect(() => {
        let hotFluid: FluidPropertiesType, coolFluid: FluidPropertiesType;

        if (fluid1.inT > fluid2.inT) {
            hotFluid = fluid1;
            coolFluid = fluid2;
        } else {
            hotFluid = fluid2;
            coolFluid = fluid1;
        }

        let deltaT1: number, deltaT2: number;

        if (flowDirection == "Paralelo") {
            deltaT1 = hotFluid.inT - coolFluid.inT;
            deltaT2 = hotFluid.outT - coolFluid.outT;
        } else {
            deltaT1 = hotFluid.inT - coolFluid.outT;
            deltaT2 = hotFluid.outT - coolFluid.inT;
        }

        setLmtd((deltaT1 - deltaT2) / Math.log(deltaT1 / deltaT2));
    }, [flowDirection, fluid1, fluid2]);

    return (
        <div className="flex justify-around gap-4 p-4 flex-wrap">
            <Card title="Parâmetros de entrada">
                <div className="grid grid-cols-[13rem_fit-content(100%)] gap-4 justify-around">
                    <div>Sentido de escoamento:</div>
                    <select
                        className="w-full rounded-md bg-white border-2 border-black"
                        value={flowDirection}
                        onChange={(event) =>
                            setFlowDirection(event.target.value)
                        }
                    >
                        {flowDirectionList.map((direction, index) => (
                            <option value={direction} key={index}>
                                {direction}
                            </option>
                        ))}
                    </select>
                </div>
            </Card>

            <Card title="Fluido 1 (externo)">
                <div className="grid grid-cols-[13rem_fit-content(100%)] gap-4 justify-around">
                    <div>Temperatura de entrada:</div>
                    <div>
                        <input
                            className="w-20 px-1 rounded-md bg-white border-2 border-black"
                            type="number"
                            step={0.01}
                            value={fluid1.inT}
                            onChange={({ target: { value } }) =>
                                setFluid1({ ...fluid1, inT: Number(value) })
                            }
                        />{" "}
                        °C
                    </div>
                    <div>Temperatura de saída:</div>
                    <div>
                        <input
                            className="w-20 px-1 rounded-md bg-white border-2 border-black"
                            type="number"
                            step={0.01}
                            value={fluid1.outT}
                            onChange={({ target: { value } }) =>
                                setFluid1({ ...fluid1, outT: Number(value) })
                            }
                        />{" "}
                        °C
                    </div>
                </div>
            </Card>

            <Card title="Fluido 2 (interno)">
                <div className="grid grid-cols-[13rem_fit-content(100%)] gap-4 justify-around">
                    <div>Temperatura de entrada:</div>
                    <div>
                        <input
                            className="w-20 px-1 rounded-md bg-white border-2 border-black"
                            type="number"
                            step={0.01}
                            value={fluid2.inT}
                            onChange={({ target: { value } }) =>
                                setFluid2({ ...fluid2, inT: Number(value) })
                            }
                        />{" "}
                        °C
                    </div>
                    <div>Temperatura de saída:</div>
                    <div>
                        <input
                            className="w-20 px-1 rounded-md bg-white border-2 border-black"
                            type="number"
                            step={0.01}
                            value={fluid2.outT}
                            onChange={({ target: { value } }) =>
                                setFluid2({ ...fluid2, outT: Number(value) })
                            }
                        />{" "}
                        °C
                    </div>
                </div>
            </Card>

            <Card title="Resultados">
                <div className="grid grid-cols-[13rem_fit-content(100%)] gap-4 justify-around">
                    <div>
                        Média logarítmica das diferenças de temperatura (LMTD)
                    </div>
                    <div>{`${lmtd.toFixed(8)} K`}</div>
                </div>
            </Card>
        </div>
    );
}
