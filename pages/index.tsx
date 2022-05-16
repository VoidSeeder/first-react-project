import {
    Area,
    AreaChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type ChartPointType = {
    x: number;
    T: number;
};

export default function Home() {
    //Ar
    const T_inf = 25; // °C
    const h = 100; // W/(m^2*K)

    //Cobre
    const k = 398; // W/(m*K)

    //Geometria
    const d = 0.005; // m (5 mm)
    const T_b = 100; // °C
    const x = 0.1;

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

        for (var x: number = x_initial; Math.round(x * 1000) / 1000 <= x_final; x += x_resolution) {
            points.push({ x: Math.round(x * 1000) / 1000, T: T_x(x) });
        }

        return points;
    }

    function getCordX(x: number): number {
        return (530 / 0.3) * x + 65;
    }

    function getCordY(x: number): number {
        return (260 / (100 - 20)) * x;
    }

    return (
        <div>
            <h2>PARTE INTERNA APENAS</h2>
            <h3>Resultados:</h3>
            <h4>Para x = 50 mm:</h4>
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
            <div className="bg-white m-4 w-[600px] h-[300px]">
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
                        {/* <Line type="monotone" dataKey="T" stroke="black" /> */}
                        <CartesianGrid
                            stroke="#ccc"
                            // verticalPoints={[
                            //     0.05, 0.1, 0.15, 0.2, 0.25, 0.3,
                            // ].map((value) => getCordX(value))}
                            // horizontalPoints={[40, 60, 100].map((value) => getCordY(value))}
                        />
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
    );
}
