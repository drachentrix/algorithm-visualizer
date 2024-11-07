import {useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import * as d3 from "d3";
import styles from "./PathfindingComponent.module.css";
import RunComponent from "./RunComponent.tsx";
import { ResponsiveContainer } from "recharts";

interface GridCell {
    row: number;
    col: number;
    isStart: boolean;
    isObstacle: boolean;
    isVisited: boolean;
}

function BackTrackingComponent() {
    const [grid, setGrid] = useState<GridCell[][]>([]);
    const [rows, setRows] = useState(10);
    const [cols, setCols] = useState(10);
    const { id } = useParams();

    const [contextMenu, setContextMenu] = useState<{
        visible: boolean; x: number; y: number; cell: GridCell | null; }>
    ({ visible: false, x: 0, y: 0, cell: null });
    const currentActionRef = useRef<string>("start");
    const startNode = useRef<GridCell>();
    const cellSize = 25;

    useEffect(() => {
        initializeGrid();
    }, []);

    useEffect(() => {
        if (grid.length === 0) {
            initializeGrid();
        } else {
            renderGrid(grid);
        }
    }, [grid]);

    useEffect(() => {
        initializeGrid();
    }, [rows, cols]);

    const initializeGrid = () => {
        const newGrid: GridCell[][] = Array.from({ length: rows }, (_, row) =>
            Array.from({ length: cols }, (_, col) => ({
                row,
                col,
                isStart: false,
                isObstacle: false,
                isVisited: false,
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
        if (cell.isObstacle) return "black";
        if (cell.isVisited) return "yellow";
        return "white";
    };

    const handleCellClick = (cell: GridCell, event: React.MouseEvent) => {
        event.preventDefault();
        setContextMenu({
            visible: true,
            x: event.clientX,
            y: event.clientY,
            cell: cell,
        });
    };

    const handleMouseDown = (event: React.MouseEvent, cell: GridCell) => {
        event.preventDefault();
        const currentAction = currentActionRef.current;

        if (event.button === 0) {
            if (currentAction === "remove") {
                updateGrid(cell, { isStart: false, isObstacle: false, isVisited: false});
            } else if (currentAction === "wall") {
                updateGrid(cell, { isStart: false, isObstacle: true, isVisited: false});
            } else if (currentAction === "start") {
                replaceExistingCell("start", cell);
                cell.isStart = true;
                startNode.current = cell;
            }
        }
    };

    const replaceExistingCell = (type: "start" | "end", newCell: GridCell) => {
        const updatedGrid = grid.map((row) =>
            row.map((node) => {
                if (type === "start" && node.isStart) {
                    return { ...node, isStart: false, isObstacle: false, isVisited: false };
                }
                if (node.row === newCell.row && node.col === newCell.col) {
                    return { ...node, isStart: true, isObstacle: false, isVisited: false }
                }
                return node;
            })
        );
        setGrid(updatedGrid);
    };

    const handleContextMenuClose = () => {
        setContextMenu({ ...contextMenu, visible: false });
    };

    const updateGrid = (cell: GridCell, properties: Partial<GridCell>) => {
        const updatedGrid = grid.map((row) =>
            row.map((node) =>
                node.row === cell.row && node.col === cell.col ? { ...node, ...properties } : node
            )
        );
        setGrid(updatedGrid);
    };

    const clearPath = (items: GridCell[][]): GridCell[][] => {
        return items.map(row =>
            row.map(cell => ({ ...cell, isVisited: false}))
        );
    };

    const applyStepsToList = (originalList: GridCell[][], currentStep: number, takenSteps: string[]): GridCell[][] => {

        return originalList
    }
    const handleChangeR = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRows(Number(event.target.value));
    };
    const handleChangeC = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCols(Number(event.target.value));
    };

    const handleSet = (value: string) => {
        currentActionRef.current = value;
        setContextMenu({ ...contextMenu, visible: false });
    };

    return(
        <ResponsiveContainer width="100%" height={450}>
            <div className={styles.baseGrid}>
                <svg id="grid-svg" width={cols * cellSize} height={rows * cellSize}></svg>
                {contextMenu.visible && (
                    <div
                        className={styles.contextMenuContainer}
                        style={{
                            top: contextMenu.y,
                            left: contextMenu.x,
                        }}
                    >
                        <ul className={styles.contextMenuList}>
                            <li onClick={() => handleSet("start")} className={styles.contextMenuItemStart}>
                                <div style={{ width: "20px", height: "20px", backgroundColor: "green", marginRight: "10px" }}></div>
                                Select Start
                            </li>
                            <li onClick={() => handleSet("end")} className={styles.contextMenuItemEnd}>
                                <div style={{ width: "20px", height: "20px", backgroundColor: "red", marginRight: "10px" }}></div>
                                Select End
                            </li>
                            <li onClick={() => handleSet("wall")} className={styles.contextMenuItemWall}>
                                <div style={{ width: "20px", height: "20px", backgroundColor: "black", marginRight: "10px" }}></div>
                                Select Wall/Obstacle
                            </li>
                            <li onClick={() => handleSet("remove")} className={styles.contextMenuItemRemove}>
                                <div style={{ width: "20px", height: "20px", backgroundColor: "lightgray", marginRight: "10px" }}></div>
                                Select Field Remover
                            </li>
                        </ul>
                        <button onClick={handleContextMenuClose} className={styles.contextMenuCloseButton}>Close</button>
                    </div>
                )}
                <RunComponent<GridCell[][]>
                    id={id!}
                    items={grid}
                    setItems={setGrid}
                    message={{
                        graph: grid,
                        algorithmId: id,
                        type: "backtracking",
                        startNode: startNode.current,
                    }}
                    clearItems={clearPath}
                    applyStep={applyStepsToList}
                />
                <input
                    value={rows}
                    type="number"
                    onChange={handleChangeR}
                    placeholder="Enter a value"
                    className={styles.inputRow}
                />
                <input
                    value={cols}
                    type="number"
                    onChange={handleChangeC}
                    placeholder="Enter a value"
                    className={styles.inputCol}
                />

                <div className={styles.legendContainer}>
                    <div className={styles.legendItem}>
                        <div className={styles.legendColorBox} style={{ backgroundColor: "green" }}></div>
                        Start Node
                    </div>
                    <div className={styles.legendItem}>
                        <div className={styles.legendColorBox} style={{ backgroundColor: "black" }}></div>
                        Obstacle/Wall
                    </div>
                    <div className={styles.legendItem}>
                        <div className={styles.legendColorBox} style={{ backgroundColor: "yellow" }}></div>
                        Visited Cell
                    </div>
                </div>
            </div>
        </ResponsiveContainer>
    )
}

export default BackTrackingComponent;