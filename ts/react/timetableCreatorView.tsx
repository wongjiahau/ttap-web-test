import {reduce, uniq} from "lodash";
import Button from "material-ui-next/Button";
import Paper from "material-ui-next/Paper";
import {Origin} from "material-ui-next/Snackbar";
import Snackbar from "material-ui-next/Snackbar";
import Typography from "material-ui-next/Typography";
import Drawer from "material-ui/Drawer";
import IconList from "material-ui/svg-icons/action/list";
import * as React from "react";
import {Beautify} from "../helper";
import {RawSlot} from "../model/rawSlot";
import {Subject} from "../model/subject";
import {SaveTimetableDialogContainer} from "../redux/containers/saveTimetableDialogContainer";
import {SubjectListViewContainer} from "../redux/containers/subjectListViewContainer";
import {TimetableListContainer} from "../redux/containers/timetableListContainer";
import { LoadTestDataView } from "./loadTestDataView";
import {Login} from "./login";
import {StackPanel} from "./panels/stackPanel";
import { SlotsTable } from "./slotsTable";
import {iconStyle} from "./styles";

const selectSubjectButtonStyle : React.CSSProperties = {
    marginBottom: "10px",
    marginLeft: "10px"
};

export interface ITimetableCreatorViewStateProps {
    isSubjectListViewVisible : boolean;
    isSlotsTableVisible : boolean;
    isSlotLoaded : boolean;
    isSnackbarVisible : boolean;
    selectedSubjects : Subject[];
    snackbarMessage : string;
    clashingSubjectPairs : Array < [Subject, Subject] >;
}

export interface ITimetableCreatorViewDispatchProps {
    handleToggleVisibilityOfSubjectListView : () => void;
    handleSnackbarAction : () => void;
    handleSlotLoaded : (rawSlots : RawSlot[]) => void;
    handleLoadDemo : (html: string) => void;
    handleCloseSlotsTable : () => void;
}

interface ITimetableCreatorViewProps extends ITimetableCreatorViewStateProps,
ITimetableCreatorViewDispatchProps {}

let viewCount = 0;
export class TimetableCreatorView extends React.Component < ITimetableCreatorViewProps, {} > {
    public render() {
        if (!this.props.isSlotLoaded) {
            return (
                <div>
                    <LoadTestDataView handleLoadDemo={this.props.handleLoadDemo}/>
                    <Login notifyDataLoaded={this.props.handleSlotLoaded}/>
                </div>
            );
        }
        viewCount++;
        const okButton = (
            <Button color="accent" dense={true} onClick={this.props.handleSnackbarAction}>
                Got it
            </Button>
        );
        const snackbarMessage = <span>{this.props.snackbarMessage}</span>;
        const anchorOrigin : Origin = {
            horizontal: "right",
            vertical: "bottom"
        };
        return (
            <div>
                <Drawer docked={false} width={520} open={this.props.isSubjectListViewVisible}>
                    <SubjectListViewContainer/>
                </Drawer>
                <SlotsTable handleClose={this.props.handleCloseSlotsTable} isOpen={this.props.isSlotsTableVisible} selectedSubjects={this.props.selectedSubjects}/>
                <Button
                    style={selectSubjectButtonStyle}
                    raised={true}
                    color="accent"
                    onClick={this.props.handleToggleVisibilityOfSubjectListView}>
                    <IconList style={iconStyle}/>
                    Select subjects
                </Button>
                {this.props.clashingSubjectPairs !== null
                    ? this.GenerateMessage(this.props.clashingSubjectPairs)
                    : <TimetableListContainer/>}
                <Snackbar
                    action={okButton}
                    open={this.props.isSnackbarVisible && (viewCount % 2 === 0)}
                    anchorOrigin={anchorOrigin}
                    SnackbarContentProps={{
                    "aria-describedby": "message-id"
                }}
                    message={snackbarMessage}/>
                <Snackbar
                    action={okButton}
                    open={this.props.isSnackbarVisible && (viewCount % 2 === 1)}
                    anchorOrigin={anchorOrigin}
                    SnackbarContentProps={{
                    "aria-describedby": "message-id"
                }}
                    message={snackbarMessage}/>
                <SaveTimetableDialogContainer/>
            </div>
        );
    }

    public componentDidMount() {
        this.setState({isSelectSubjectPanelOpened: true});
    }

    private GenerateMessage(clashingSubjectPairs : Array < [Subject, Subject] >): React.ReactNode {
        const paperStyle: React.CSSProperties = {
            padding: "10px"
        };
        const subjectsInvolved = uniq < Subject > (reduce(clashingSubjectPairs, (result, x) => result.concat(x), []));
        const stringifySubject = (s : Subject) => Beautify(s.Name) + "(" + s.Code + ")";
        return (
            <Paper style={paperStyle}>
                <StackPanel orientation="vertical" horizontalAlignment="center">
                    <Typography type="display2" color="inherit">
                        No possible timetable is found because:
                    </Typography>
                    <br/>
                    <table>
                        {clashingSubjectPairs.map((pair, index) => {
                            return (
                                <tr key={index}>
                                    <td>{"- " + stringifySubject(pair[0])}</td>
                                    <td>
                                        <i>is clashing with</i>
                                    </td>
                                    <td>{stringifySubject(pair[1])}<br/></td>
                                </tr>
                            );
                        })}
                    </table>
                    <br/>
                    <Typography type="display1" color="inherit">
                        Try deselecting one of the following subjects :
                    </Typography>
                    <ul>
                        {subjectsInvolved.map((x) => (
                            <li>{stringifySubject(x)}</li>
                        ))}
                    </ul>
                </StackPanel>
            </Paper>
        );
    }
}
