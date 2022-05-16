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

type OptionType = { label: string; value: number };

export default function Home() {
    //Ar
    const T_inf = 25; // °C
    const h = 100; // W/(m^2*K)

    //k
    const k_copper = 398; // W/(m*K)
    const k_steel = 14;
    const k_aluminum = 180;

    const options: OptionType[] = [
        { label: "copper", value: k_copper },
        { label: "steel", value: k_steel },
        { label: "aluminum", value: k_aluminum },
    ];

    //Geometria
    const d = 0.005; // m (5 mm)
    const T_b = 100; // °C
    const [x, setX] = useState(0.05);

    const [k, setK] = useState(options[0].value);

    function temperatureDistribution(m: number, x: number): number {
        return Math.exp(-m * x);
    }

    function M(
        h: number,
        P: number,
        k: number,
        A_tr: number,
        theta_b: number
    ): number {
        return Math.sqrt(h * P * k * A_tr) * theta_b;
    }

    function P(d: number): number {
        return Math.PI * d;
    }

    function finHeatTransferHate(M: number): number {
        return M;
    }

    function m(h: number, P: number, k: number, A_tr: number): number {
        return Math.sqrt((h * P) / (k * A_tr));
    }

    function A_tr(radius: number): number {
        return Math.PI * Math.pow(radius, 2);
    }

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

    return (
        <div>
            <h2>PARTE INTERNA APENAS</h2>
            <h3>Resultados:</h3>
            <h4>
                Para x ={" "}
                <input
                className="p-1 w-16"
                    type="number"
                    step={1}
                    value={Math.round(x * 100)}
                    onChange={(event) => setX(Number(event.target.value) / 100)}
                />{" "}
                mm:
            </h4>
            <p>
                theta/theta_b ={" "}
                {temperatureDistribution(m(h, P(d), k, A_tr(d / 2)), x)}
            </p>
            <p>
                q_f:{" "}
                {finHeatTransferHate(
                    M(h, P(d), k, A_tr(d / 2), theta_b(T_b, T_inf))
                )}
            </p>
            <p>
                T(x):{" "}
                {T(
                    T_inf,
                    T_b,
                    temperatureDistribution(m(h, P(d), k, A_tr(d / 2)), x)
                )}
            </p>
            Selecione o material:{" "}
            <select
                value={k}
                onChange={(event) => setK(Number(event.target.value))}
            >
                {options.map(({ label, value }, index) => (
                    <option value={value} key={index}>
                        {label}
                    </option>
                ))}
            </select>
            <div className="bg-white p-4">
                <div className="w-[600px] h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            width={600}
                            height={300}
                            data={generateChartPoints(
                                0,
                                0.4,
                                0.025,
                                (x_value: number) => {
                                    return T(
                                        T_inf,
                                        T_b,
                                        temperatureDistribution(
                                            m(h, P(d), k, A_tr(d / 2)),
                                            x_value
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
        </div>
    );
}
