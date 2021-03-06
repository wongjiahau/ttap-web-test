import Button from "material-ui-next/Button";
import Dialog from "material-ui-next/Dialog";
import Slide from "material-ui-next/transitions/Slide";
import Typography from "material-ui-next/Typography";
import * as React from "react";
import CountUp from "react-countup";
import {ColorOfDefinitelyOccupied, ColorOfDefinitelyUnoccupied, ColorOfMaybeOccupied, STCBox} from "../model/states/stcBox";
import {Colors} from "./colors/colors";
import {StackPanel} from "./panels/stackPanel";
import {TimetableView} from "./timetableView/timetableView";

// region style
const typo1Style : React.CSSProperties = {
    marginTop: "15px",
    marginLeft: "65px",
    marginRight: "10px"
};

const divStyle : React.CSSProperties = {
    textAlign: "center",
    overflowY: "auto"
};

const tableStyle : React.CSSProperties = {
    width: "100%"
};

const legendFrameStyle : React.CSSProperties = {
    height: "100px",
    margin: "0 auto",
    width: "400",
    border: "solid 1px lightgrey",
    padding: "10px"
};

const cancelButtonStyle : React.CSSProperties = {
    marginRight: "10px"
};

// endregion style

function Transition(props) {
    return <Slide direction="up" {...props}/>;
}

type LegendType = "red" | "grey" | "green";
interface ILegendProps {
    type : LegendType;
    label : string;
}

const Legend = (props : ILegendProps) => {
    const background = () => {
        switch (props.type) {
            case "red":
                return ColorOfDefinitelyOccupied;
            case "grey":
                return ColorOfDefinitelyUnoccupied;
            case "green":
                return ColorOfMaybeOccupied;
        }
    };

    const legendSymbol : React.CSSProperties = {
        marginRight: "10px",
        width: "30px",
        height: "20px",
        float: "left",
        background: background()
    };

    const legendLabel : React.CSSProperties = {
        float: "left"
    };

    return (
        <tr>
            <td style={legendSymbol}/>
            <td style={legendLabel}>
                <Typography type="subheading">
                    {props.label}
                </Typography>
            </td>
        </tr>
    );
};

export interface ISetTimeConstraintViewStateProps {
    totalState : STCBox[];
    isOpen : boolean;
    numberOfRemovedTimetables : number;
    numberOfRemainingTimetables : number;
}

export interface ISetTimeConstraintViewDispatchProps {
    handleSetTimeConstraintAt : (stcBox : STCBox) => void;
    handleDesetTimeConstraintAt : (stcBox : STCBox) => void;
    handleCancel : () => void;
}

interface ISetTimeConstraintViewProps extends ISetTimeConstraintViewStateProps,
ISetTimeConstraintViewDispatchProps {}
export class SetTimeConstraintView extends React.Component < ISetTimeConstraintViewProps, {} > {
    public render() {
        return (
            <div>
                <Dialog open={this.props.isOpen} fullScreen={true} transition={Transition}>
                    <div style={divStyle}>
                        <table style={tableStyle}>
                            <tbody>
                                <tr>
                                    <td>
                                        <Typography
                                            type="display3"
                                            style={typo1Style}
                                            gutterBottom={true}
                                            align="center">
                                            Set time constraint
                                        </Typography>
                                    </td>
                                    <td>
                                        <table style={legendFrameStyle}>
                                            <tbody>
                                                <Legend type="grey" label="Definitely no class"/>
                                                <Legend type="red" label="Definitely have class"/>
                                                <Legend type="green" label="Click me if you don't want to have class here"/>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <TimetableView
                            timetable={null}
                            states={this.props.totalState}
                            handleSetTimeContraintAt={this.props.handleSetTimeConstraintAt}
                            handleDesetTimeContraintAt={this.props.handleDesetTimeConstraintAt}/> {this.props.numberOfRemovedTimetables > 0
                            ? (
                                <StackPanel
                                    orientation="horizontal"
                                    horizontalAlignment="center"
                                    >
                                    <p>Removed</p>
                                    <CountUp start={0} end={this.props.numberOfRemovedTimetables} duration={0.65}/>
                                    <p>unsatisfactory timetables.</p>
                                    <CountUp
                                        start={0}
                                        end={this.props.numberOfRemainingTimetables}
                                        duration={0.65}/>
                                    <p>timetables remaining</p>
                                </StackPanel>
                            )
                            : <p>{""}</p>
                            }
                        <Button
                            style={cancelButtonStyle}
                            color="default"
                            onClick={this.props.handleCancel}>Cancel</Button>
                        <Button raised={true} color="primary" onClick={this.props.handleCancel}>Done</Button>
                    </div>
                </Dialog>
            </div>
        );
    }
}
