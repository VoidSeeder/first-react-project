import Image from "next/image";
import { useState } from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type ChartPointType = {
    x: number;
    T: number;
};

type OptionType = { name: string; label: string; value: number };

type AreaFormatType = {
    name: string;
    inputA: { name: string; value: number };
    inputB?: { name: string; value: number };
    getArea: (inputA: number, inputB?: number) => number;
    getPerimeter: (inputA: number, inputB?: number) => number;
    imgUrl: string;
};

type CaseType = {
    name: string;
    description: string;
    temperatureDistribution: Function;
    finHeatTransferHate: Function;
};

export default function Home() {
    //Ar
    const T_inf = 25; // °C
    const h = 100; // W/(m^2*K)

    //k
    const k_copper = 398; // W/(m*K)
    const k_steel = 14;
    const k_aluminum = 180;

    const materialOptions: OptionType[] = [
        { name: "copper", label: "Cobre", value: k_copper },
        { name: "steel", label: "Alumínio 2024", value: k_steel },
        { name: "aluminum", label: "Aço Inox AISI 316", value: k_aluminum },
    ];

    const [k, setK] = useState(materialOptions[0].value);
    const [L, setL] = useState(0.4);
    const [T_L, setT_L] = useState(0);

    const caseOptions: CaseType[] = [
        {
            name: "A",
            description: "Convection heat transfer",
            temperatureDistribution: (
                m: number,
                x: number,
                L: number,
                h: number,
                k: number,
                theta_L?: number,
                theta_b?: number
            ): number => {
                return (
                    (Math.cosh(m * (L - x)) +
                        (h / (m * k)) * Math.sinh(m * (L - x))) /
                    (Math.cosh(m * L) + (h / (m * k)) * Math.sinh(m * L))
                );
            },
            finHeatTransferHate: (
                M: number,
                m: number,
                L: number,
                h: number,
                k: number,
                theta_L?: number,
                theta_b?: number
            ): number => {
                return (
                    M *
                    ((Math.sinh(m * L) + (h / (m * k)) * Math.cosh(m * L)) /
                        (Math.cosh(m * L) + (h / (m * k)) * Math.sinh(m * L)))
                );
            },
        },
        {
            name: "B",
            description: "Adiabatic",
            temperatureDistribution: (
                m: number,
                x: number,
                L: number,
                h?: number,
                k?: number,
                theta_L?: number,
                theta_b?: number
            ): number => {
                return Math.cosh(m * (L - x)) / Math.cosh(m * L);
            },
            finHeatTransferHate: (
                M: number,
                m: number,
                L: number,
                h?: number,
                k?: number,
                theta_L?: number,
                theta_b?: number
            ): number => {
                return M * Math.tanh(m * L);
            },
        },
        {
            name: "C",
            description: "Prescribed temperature",
            temperatureDistribution: (
                m: number,
                x: number,
                L: number,
                h: number,
                k: number,
                theta_L: number,
                theta_b: number
            ): number => {
                return (
                    ((theta_L / theta_b) * Math.sinh(m * x) +
                        Math.sinh(m * (L - x))) /
                    Math.sinh(m * L)
                );
            },
            finHeatTransferHate: (
                M: number,
                m: number,
                L: number,
                h: number,
                k: number,
                theta_L: number,
                theta_b: number
            ): number => {
                return (
                    (M * (Math.cosh(m * L) - theta_L / theta_b)) /
                    Math.sinh(m * L)
                );
            },
        },
        {
            name: "D",
            description: "Infinite fin",
            temperatureDistribution: (
                m: number,
                x: number,
                L?: number,
                h?: number,
                k?: number,
                theta_L?: number,
                theta_b?: number
            ): number => {
                return Math.exp(-m * x);
            },
            finHeatTransferHate: (M: number): number => {
                return M;
            },
        },
    ];

    const [selectedCase, setSelectedCase] = useState(caseOptions[3]);

    const areaFormats: AreaFormatType[] = [
        {
            name: "rectangular",
            inputA: { name: "w", value: 0.01 },
            inputB: { name: "t", value: 0.01 },
            getArea: (h, w = 1) => h * w,
            getPerimeter: (h, w = 1) => 2 * (h + w),
            imgUrl: "/rectangularFin.png",
        },
        {
            name: "circular",
            inputA: { name: "d", value: 0.01 },
            getArea: (d) => Math.PI * Math.pow(d / 2, 2),
            getPerimeter: (d) => Math.PI * d,
            imgUrl: "/circularFin.png",
        },
    ];

    const [areaFormat, setAreaFormat] = useState(areaFormats[0]);

    //Geometria
    const d = 0.005; // m (5 mm)
    const T_b = 100; // °C

    const [x, setX] = useState(0.05);

    // function temperatureDistribution(m: number, x: number): number {
    //     return Math.exp(-m * x);
    // }

    function M(
        h: number,
        P: number,
        k: number,
        A_tr: number,
        theta_b: number
    ): number {
        return Math.sqrt(h * P * k * A_tr) * theta_b;
    }

    // function P(d: number): number {
    //     return Math.PI * d;
    // }

    // function finHeatTransferHate(M: number): number {
    //     return M;
    // }

    function m(h: number, P: number, k: number, A_tr: number): number {
        return Math.sqrt((h * P) / (k * A_tr));
    }

    // function A_tr(radius: number): number {
    //     return Math.PI * Math.pow(radius, 2);
    // }

    function theta_b(T_b: number, T_inf: number): number {
        return T_b - T_inf;
    }

    function T(
        T_inf: number,
        T_b: number,
        temperatureDistribution: number
    ): number {
        return T_inf + (T_b - T_inf) * temperatureDistribution;
    }

    function generateChartPoints(
        x_initial: number,
        x_final: number,
        x_resolution: number,
        T_x: (x: number) => number
    ): ChartPointType[] {
        const points: ChartPointType[] = [];

        for (
            var x: number = x_initial;
            Math.round(x * 1000) / 1000 <= x_final;
            x += x_resolution
        ) {
            points.push({ x: Math.round(x * 1000) / 1000, T: T_x(x) });
        }

        return points;
    }

    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <div>
                <div className="flex justify-around gap-4 p-4 flex-wrap">
                    <div className="bg-white rounded-xl p-4 h-fit w-fit">
                        <div className="w-fit mx-auto">
                            Parâmetros de entrada
                        </div>
                        <div className="h-[1px] -mx-4 bg-black my-2" />
                        <div className="flex gap-4">
                            <div className="h-32 w-40 relative">
                                <Image
                                    src={areaFormat.imgUrl}
                                    layout="fill"
                                ></Image>
                            </div>
                            <div className="grid grid-cols-[100px_200px] gap-4 justify-around">
                                <div>Formato:</div>
                                <select
                                    className="w-full rounded-md bg-white border-2 border-black"
                                    value={areaFormats.findIndex(
                                        (format) =>
                                            format.name == areaFormat.name
                                    )}
                                    onChange={(event) =>
                                        setAreaFormat(
                                            areaFormats[
                                                Number(event.target.value)
                                            ]
                                        )
                                    }
                                >
                                    {areaFormats.map((format, index) => (
                                        <option value={index} key={index}>
                                            {format.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="h-fit my-auto">Dimensões:</div>
                                <div>
                                    <div className="p-2">
                                        L:{" "}
                                        <input
                                            className="w-20 px-1 rounded-md bg-white border-2 border-black"
                                            type="number"
                                            step={0.01}
                                            value={L}
                                            onChange={(event) =>
                                                setL(Number(event.target.value))
                                            }
                                        />{" "}
                                        metros
                                    </div>
                                    {areaFormat?.inputA && (
                                        <div className="p-2">
                                            {areaFormat.inputA.name}:{" "}
                                            <input
                                                className="w-20 px-1 rounded-md bg-white border-2 border-black"
                                                type="number"
                                                step={0.001}
                                                value={areaFormat.inputA.value}
                                                onChange={(event) => {
                                                    setAreaFormat({
                                                        ...areaFormat,
                                                        inputA: {
                                                            ...areaFormat.inputA,
                                                            value: Number(
                                                                event.target
                                                                    .value
                                                            ),
                                                        },
                                                    });
                                                }}
                                            />{" "}
                                            metros
                                        </div>
                                    )}
                                    {areaFormat?.inputB != undefined && (
                                        <div className="p-2">
                                            {areaFormat.inputB.name}:{" "}
                                            <input
                                                className="w-20 px-1 rounded-md bg-white border-2 border-black"
                                                type="number"
                                                step={0.001}
                                                value={areaFormat.inputB.value}
                                                onChange={(event) => {
                                                    setAreaFormat({
                                                        ...areaFormat,
                                                        inputB: {
                                                            name:
                                                                areaFormat
                                                                    .inputB
                                                                    ?.name ??
                                                                " ",
                                                            value: Number(
                                                                event.target
                                                                    .value
                                                            ),
                                                        },
                                                    });
                                                }}
                                            />{" "}
                                            metros
                                        </div>
                                    )}
                                </div>
                                <div>Material:</div>
                                <select
                                    className="w-full rounded-md bg-white border-2 border-black"
                                    value={k}
                                    onChange={(event) =>
                                        setK(Number(event.target.value))
                                    }
                                >
                                    {materialOptions.map(
                                        ({ label, value }, index) => (
                                            <option value={value} key={index}>
                                                {label}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 h-fit w-fit">
                        <div className="w-fit mx-auto">Gráfico</div>
                        <div className="h-[1px] -mx-4 bg-black my-2" />
                        <div className="w-[600px] h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    width={600}
                                    height={300}
                                    data={generateChartPoints(
                                        0,
                                        L,
                                        0.025,
                                        (x_value: number) => {
                                            return T(
                                                T_inf,
                                                T_b,
                                                selectedCase.temperatureDistribution(
                                                    m(
                                                        h,
                                                        areaFormat.getPerimeter(
                                                            areaFormat.inputA
                                                                .value,
                                                            areaFormat?.inputB
                                                                ?.value
                                                        ),
                                                        k,
                                                        areaFormat.getArea(
                                                            areaFormat.inputA
                                                                .value,
                                                            areaFormat?.inputB
                                                                ?.value
                                                        )
                                                    ),
                                                    x_value,
                                                    L,
                                                    h,
                                                    k,
                                                    T_L - T_inf,
                                                    T_b - T_inf
                                                )
                                            );
                                        }
                                    )}
                                >
                                    <CartesianGrid stroke="#ccc" />
                                    <XAxis dataKey="x" />
                                    <YAxis type="number" domain={[20, 100]} />
                                    <Tooltip />
                                    <Area
                                        type="monotone"
                                        dataKey="T"
                                        stroke="#8884d8"
                                        fill="#8884d8"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div
                        className="bg-white rounded-xl p-4 h-fit w-fit cursor-pointer"
                        onClick={() => setModalOpen(true)}
                    >
                        <div className="relative h-52 w-[26rem]">
                            <Image layout="fill" src="/casesTable.png" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 h-fit min-w-[12rem]">
                        <div className="w-fit mx-auto">Caso</div>
                        <div className="h-[1px] -mx-4 bg-black my-2" />
                        <select
                            className="w-full rounded-md bg-white border-2 border-black"
                            value={caseOptions.findIndex(
                                (caseOption) =>
                                    caseOption.name == selectedCase.name
                            )}
                            onChange={(event) =>
                                setSelectedCase(
                                    caseOptions[Number(event.target.value)]
                                )
                            }
                        >
                            {caseOptions.map((caseOption, index) => (
                                <option value={index} key={index}>
                                    {caseOption.name}
                                </option>
                            ))}
                        </select>
                        {selectedCase.name == "C" && (
                            <div className="p-2">
                                T_L:{" "}
                                <input
                                    className="w-20 px-1 rounded-md bg-white border-2 border-black"
                                    type="number"
                                    step={0.01}
                                    value={T_L}
                                    onChange={(event) =>
                                        setT_L(Number(event.target.value))
                                    }
                                />{" "}
                                °C
                            </div>
                        )}
                    </div>
                    <div className="bg-white rounded-xl p-4 h-fit w-fit min-w-[22rem]">
                        <div className="w-fit mx-auto">Valores pontuais</div>
                        <div className="h-[1px] -mx-4 bg-black my-2" />
                        <div className="flex gap-1">
                            <div className="font-bold">Para x =</div>
                            <input
                                className="w-20 px-1 rounded-md bg-white border-2 border-black"
                                type="number"
                                value={x * 100}
                                onChange={(event) =>
                                    setX(Number(event.target.value) / 100)
                                }
                            />{" "}
                            mm:
                        </div>
                        <div className="flex gap-1">
                            <div className="font-bold">theta/theta_b =</div>
                            <div>
                                {selectedCase.temperatureDistribution(
                                    m(
                                        h,
                                        areaFormat.getPerimeter(
                                            areaFormat.inputA.value,
                                            areaFormat?.inputB?.value
                                        ),
                                        k,
                                        areaFormat.getArea(
                                            areaFormat.inputA.value,
                                            areaFormat?.inputB?.value
                                        )
                                    ),
                                    x,
                                    L,
                                    h,
                                    k,
                                    T_L - T_inf,
                                    T_b - T_inf
                                )}
                            </div>
                        </div>
                        <div className="flex gap-1">
                            <div className="font-bold">q_f =</div>
                            <div>
                                {selectedCase.finHeatTransferHate(
                                    M(
                                        h,
                                        areaFormat.getPerimeter(
                                            areaFormat.inputA.value,
                                            areaFormat?.inputB?.value
                                        ),
                                        k,
                                        areaFormat.getArea(
                                            areaFormat.inputA.value,
                                            areaFormat?.inputB?.value
                                        ),
                                        theta_b(T_b, T_inf)
                                    ),
                                    m(
                                        h,
                                        areaFormat.getPerimeter(
                                            areaFormat.inputA.value,
                                            areaFormat?.inputB?.value
                                        ),
                                        k,
                                        areaFormat.getArea(
                                            areaFormat.inputA.value,
                                            areaFormat?.inputB?.value
                                        )
                                    ),
                                    L,
                                    h,
                                    k,
                                    T_L - T_inf,
                                    T_b - T_inf
                                )}{" "}
                                W
                            </div>
                        </div>
                        <div className="flex gap-1">
                            <div className="font-bold">T(x) =</div>
                            <div>
                                {T(
                                    T_inf,
                                    T_b,
                                    selectedCase.temperatureDistribution(
                                        m(
                                            h,
                                            areaFormat.getPerimeter(
                                                areaFormat.inputA.value,
                                                areaFormat?.inputB?.value
                                            ),
                                            k,
                                            areaFormat.getArea(
                                                areaFormat.inputA.value,
                                                areaFormat?.inputB?.value
                                            )
                                        ),
                                        x,
                                        L,
                                        h,
                                        k,
                                        T_L - T_inf,
                                        T_b - T_inf
                                    )
                                )}{" "}
                                °C
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {modalOpen && (
                <div
                    className="fixed top-0 left-0 z-50 h-screen w-screen bg-black bg-black/50 flex justify-center"
                    onClick={() => setModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-xl p-4 h-fit w-fit cursor-pointer m-auto"
                        onClick={() => setModalOpen(true)}
                    >
                        <div className="relative h-[27.5rem] w-[56rem]">
                            <Image layout="fill" src="/casesTable.png" />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
