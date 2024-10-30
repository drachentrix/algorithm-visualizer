import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import styles from "./PathfindingComponent.module.css";
import RunComponent from "./RunComponent.tsx";
import { useParams } from "react-router-dom";

interface GridCell {
    row: number;
    col: number;
    isStart: boolean;
    isEnd: boolean;
    isObstacle: boolean;
    isPath: boolean;
}

const PathfindingComponent: React.FC = () => {
    const [grid, setGrid] = useState<GridCell[][]>([]);
    const [startNode, setStartNode] = useState<GridCell>();
    const [rows, setRows] = useState(10)
    const [cols, setCols] = useState(10)

    const { id } = useParams();
    const [contextMenu, setContextMenu] = useState<{
        visible: boolean; x: number; y: number; cell: GridCell | null; }>
    ({ visible: false, x: 0, y: 0, cell: null });

    const currentActionRef = useRef<string>("start");
    const cellSize = 25;

    useEffect(() => {
        initializeGrid();
    }, []);

    useEffect(() => {
        renderGrid(grid);
    }, [grid]);

    const handleSet = (value: string) => {
        currentActionRef.current = value;
        setContextMenu({ ...contextMenu, visible: false });
    };

    const initializeGrid = () => {
        const newGrid: GridCell[][] = Array.from({ length: rows }, (_, row) =>
            Array.from({ length: cols }, (_, col) => ({
                row,
                col,
                isStart: false,
                isEnd: false,
                isObstacle: false,
                isPath: false,
            }))
        );
        setGrid(newGrid);
    };

    const renderGrid = (grid: GridCell[][]) => {
        const svg = d3.select("#grid-svg");
        svg.selectAll("*").remove();

        svg
            .selectAll<SVGRectElement, GridCell>("rect")
            .data(grid.flat())
            .enter()
            .append("rect")
            .attr("x", (d) => d.col * cellSize)
            .attr("y", (d) => d.row * cellSize)
            .attr("width", cellSize)
            .attr("height", cellSize)
            .attr("fill", (d) => getCellColor(d))
            .attr("stroke", "black")
            .on("contextmenu", (event, d) => handleCellClick(d, event))
            .on("mousedown", (event, d) => handleMouseDown(event, d));

        d3.select("body").on("click", handleContextMenuClose);
    };

    const getCellColor = (cell: GridCell) => {
        if (cell.isStart) return "green";
        if (cell.isEnd) return "red";
        if (cell.isObstacle) return "black";
        if (cell.isPath) return "yellow";
        return "white";
    };

    const handleCellClick = (cell: GridCell, event: React.MouseEvent) => {
        event.preventDefault();

        const svg = document.getElementById("grid-svg");
        if (svg) {
            const { left, top } = svg.getBoundingClientRect();
            setContextMenu({visible: true, x: event.clientX - left, y: event.clientY - top, cell: cell});
        }
    };

    const handleMouseDown = (event: React.MouseEvent, cell: GridCell) => {
        event.preventDefault();
        const currentAction = currentActionRef.current;

        if (event.button === 0) {
            if (currentAction === "remove") {
                updateGrid(cell, { isStart: false, isEnd: false, isObstacle: false, isPath: false });
            } else if (currentAction === "wall") {
                updateGrid(cell, { isStart: false, isEnd: false, isObstacle: true, isPath: false });
            } else if (currentAction === "start") {
                replaceExistingCell("start", cell);
                setStartNode(cell);
            } else if (currentAction === "end") {
                replaceExistingCell("end", cell);
            }
        }
    };

    const replaceExistingCell = (type: "start" | "end", newCell: GridCell) => {
        const updatedGrid = grid.map((row) =>
            row.map((node) => {
                if (type === "start" && node.isStart) {
                    return { ...node, isStart: false, isEnd: false, isObstacle: false, isPath: false };
                }
                if (type === "end" && node.isEnd) {
                    return { ...node, isStart: false, isEnd: false, isObstacle: false, isPath: false };
                }
                if (node.row === newCell.row && node.col === newCell.col) {
                    return type === "start" ? { ...node, isStart: true, isEnd: false, isObstacle: false, isPath: false }
                        : { ...node, isStart: false, isEnd: true, isObstacle: false, isPath: false };
                }
                return node;
            })
        );
        setGrid(updatedGrid);
    };

    const handleContextMenuClose = () => {
        setContextMenu({ ...contextMenu, visible: false });
    };

    const applyStepsToList = (originalList: GridCell[][], currentStep: number, takenSteps: string[]) => {
        let modifiedItems = [...originalList];

        if (currentStep === 0) {
            return originalList;
        }

        for (let i = 0; i < currentStep; i++) {
            let step = takenSteps[i].split(":")
            modifiedItems[step[0] as unknown as number][step[1] as unknown as number].isPath = true;
        }
        return modifiedItems;
    };

    const updateGrid = (cell: GridCell, properties: Partial<GridCell>) => {
        const updatedGrid = grid.map((row) =>
            row.map((node) =>
                node.row === cell.row && node.col === cell.col ? { ...node, ...properties } : node
            )
        );
        setGrid(updatedGrid);
    };

    const handleChangeR = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRows(Number(event.target.value));
    };
    const handleChangeC = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCols(Number(event.target.value));
    };

    return (
        <div className={styles.baseGrid}>
            <svg id="grid-svg" width={cols * cellSize} height={rows * cellSize}></svg>
            {contextMenu.visible && (
                <div
                    className={styles.contextMenu}
                    style={{
                        top: contextMenu.y,
                        left: contextMenu.x,
                    }}
                >
                    <ul>
                        <li onClick={() => handleSet("start")} className={styles.start}>
                            <div style={{ width: "20px", height: "20px", backgroundColor: "green", marginRight: "10px" }}></div>
                            Select Start
                        </li>
                        <li onClick={() => handleSet("end")} className={styles.end}>
                            <div style={{ width: "20px", height: "20px", backgroundColor: "red", marginRight: "10px" }}></div>
                            Select End
                        </li>
                        <li onClick={() => handleSet("wall")} className={styles.wall}>
                            <div style={{ width: "20px", height: "20px", backgroundColor: "black", marginRight: "10px" }}></div>
                            Select Wall/Obstacle
                        </li>
                        <li onClick={() => handleSet("remove")} className={styles.remove}>
                            <div style={{ width: "20px", height: "20px", backgroundColor: "lightgray", marginRight: "10px" }}></div>
                            Select Field Remover
                        </li>
                    </ul>
                    <button onClick={handleContextMenuClose} className={styles.closeButton}>Close</button>
                </div>
            )}
            <RunComponent<GridCell[][]> id={id!} items={grid} setItems={setGrid} message={{ graph: grid, algorithmId: id, type: "pathfinder", startNode: startNode }} applyStep={applyStepsToList} />
            <input value={rows} type="number" onChange={handleChangeR} placeholder="Enter a value"/>
            <input value={cols} type="number" onChange={handleChangeC} placeholder="Enter a value"/>
        </div>
    );
};

export default PathfindingComponent;
