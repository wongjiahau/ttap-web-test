import AddIcon from "material-ui-icons/Add";
import CloudIcon from "material-ui-icons/CloudUpload";
import FileIcon from "material-ui-icons/InsertDriveFile";
import PictureIcon from "material-ui-icons/InsertPhoto";
import Button from "material-ui-next/Button";
import Dialog, {DialogTitle} from "material-ui-next/Dialog";
import List, {ListItem, ListItemIcon, ListItemText} from "material-ui-next/List";
import * as React from "react";
import { GetSemStartDateDialog } from "./getSemStartDateDialog";

const cancelButtonStyle : React.CSSProperties = {
    marginBottom: "7px",
    marginLeft: "7px"
};

export interface ISaveTimetableDialogStateProps {
    isMainDialogOpen: boolean;
    isGetDateDialogOpen: boolean;
}

export interface ISaveTimetableDialogDispatchProps {
    handleClose:                ()          => void;
    handleCloseGetDateDialog:   ()          => void;
    handleOpenGetDateDialog:    ()          => void;
    handleSaveAsPicture:        ()          => void;
    handleSaveAsTextFile:       ()          => void;
    handleSaveToGoogleCalendar: (semStartDate: Date) => void;
}

export interface ISaveTimetableDialogProps extends ISaveTimetableDialogStateProps,
ISaveTimetableDialogDispatchProps {}

export class SaveTimetableDialog extends React.Component < ISaveTimetableDialogProps, {} > {
    public render() {
        return (
            <Dialog open={this.props.isMainDialogOpen}>
                <DialogTitle>Save this timetable as . . .</DialogTitle>
                <div>
                    <List>
                        <ListItem button={true} onClick={this.props.handleSaveAsTextFile}>
                            <ListItemIcon>
                                <FileIcon/>
                            </ListItemIcon>
                            <ListItemText primary={"Text file"}/>
                        </ListItem>
                        <ListItem button={true} onClick={this.props.handleSaveAsPicture}>
                            <ListItemIcon>
                                <PictureIcon/>
                            </ListItemIcon>
                            <ListItemText primary={"Picture"}/>
                        </ListItem>
                        <ListItem button={true} onClick={this.props.handleOpenGetDateDialog}>
                            <ListItemIcon>
                                <CloudIcon/>
                            </ListItemIcon>
                            <ListItemText primary={"Google Calendar"}/>
                        </ListItem>
                    </List>
                    <Button color="primary" style={cancelButtonStyle} onClick={this.props.handleClose}>cancel</Button>
                </div>
                <GetSemStartDateDialog isOpen={this.props.isGetDateDialogOpen} handleClose={this.props.handleCloseGetDateDialog} handleSaveToGoogleCalendar={this.props.handleSaveToGoogleCalendar}/>
            </Dialog>
        );
    }
}
