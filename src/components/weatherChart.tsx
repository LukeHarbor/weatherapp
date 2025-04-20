import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { useAppSelector } from '../app/hooks';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceArea,
} from 'recharts';
import type { RootState } from '../app/store';

const WeatherChart: React.FC = () => {
    const { weather, unit } = useAppSelector((state: RootState) => state.weather);
    const data = weather?.forecast ?? [];

    const chartWrapperRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 700);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const scrollBy = (delta: number) => {
        chartWrapperRef.current?.scrollBy({ left: delta, behavior: 'smooth' });
    };

    const referenceAreas = useMemo(() => {
        const areas = [];
        let last = '', start = 0, toggle = false;
        data.forEach((d, i) => {
            if (d.date !== last && last) {
                areas.push({ start, end: i - 1, toggle });
                start = i;
                toggle = !toggle;
            }
            last = d.date;
        });
        if (last) areas.push({ start, end: data.length - 1, toggle });
        return areas;
    }, [data]);

    const getWeatherEmoji = useCallback((desc: string) => {
        if (desc.includes('clear')) return '☀️';
        if (desc.includes('cloud')) return '☁️';
        if (desc.includes('rain')) return '🌧️';
        if (desc.includes('snow')) return '❄️';
        if (desc.includes('storm')) return '⛈️';
        return '🌤️';
    }, []);

    const yDomain = useMemo(() => {
        const vals = data.map(d => unit === 'C' ? d.tempC : d.tempF);
        return [Math.floor(Math.min(...vals)) - 2, Math.ceil(Math.max(...vals)) + 2];
    }, [data, unit]);

    const renderTooltip = useCallback(({ payload }: any) => {
        if (!payload || payload.length === 0) return null;
        const entry = payload[0].payload;
        const emoji = getWeatherEmoji(entry.description ?? '');
        const temp = unit === 'C' ? entry.tempC : entry.tempF;
        const feels = unit === 'C' ? entry.feels_like_C : entry.feels_like_F;

        return (
            <div style={{
                backgroundColor: '#427AA1',
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
            }}>
                <strong>{entry.label} {emoji}</strong>
                <p style={{ fontSize: '30px', margin: '10px 0' }}>{temp}° {unit}</p>
                <p style={{ margin: 0 }}>Feels like {feels}° {unit}</p>
            </div>
        );
    }, [getWeatherEmoji, unit]);

    if (!weather || !mounted) return <p>Loading chart...</p>;

    const chartMinWidth = Math.max(data.length * 60, 900);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {isMobile && (
                <>
                    <button
                        className="scroll-arrow left"
                        onClick={() => scrollBy(-200)}
                    >🡰</button>
                    <button
                        className="scroll-arrow right"
                        onClick={() => scrollBy(200)}
                    >🡲</button>
                </>
            )}

            <div
                ref={chartWrapperRef}
                className="chart-scroll-wrapper"
                style={{
                    overflowX: isMobile ? 'auto' : 'visible',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    height: '100%',
                }}
            >
                <div style={{ minWidth: isMobile ? chartMinWidth : '100%', height: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="label"
                                tickFormatter={(label: string, index: number) => {
                                    const [_, time] = label.split(', ');
                                    return time === '00:00' ? data[index].date : '';
                                }}
                                interval={0}
                                tick={{ fill: 'white' }}
                            />
                            <YAxis domain={yDomain} tick={{ fill: 'white' }} />
                            <Tooltip content={renderTooltip} />
                            <Line
                                type="monotone"
                                dataKey={unit === 'C' ? 'tempC' : 'tempF'}
                                stroke="white"
                                name="Temperature"
                                strokeWidth={2}
                                dot={{ r: 2, fill: 'white' }}
                                activeDot={{ r: 5 }}
                            />
                            {referenceAreas.map((a, i) => (
                                <ReferenceArea
                                    key={i}
                                    x1={data[a.start]?.label}
                                    x2={data[a.end + 1]?.label ?? data[a.end]?.label}
                                    fill={a.toggle ? 'rgba(0,0,255,0.1)' : '#1F2041'}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default WeatherChart;
