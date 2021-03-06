import Button from "material-ui-next/Button";
import Dialog, {DialogTitle} from "material-ui-next/Dialog";
import * as React from "react";
import Flatpickr from "react-flatpickr";
import {StackPanel} from "./panels/stackPanel";

export interface IGetSemStartDateDialogState {
    date : Date;
    dateIsSelected : boolean;
}

export interface IGetSemStartDateDialogProps {
    isOpen : boolean;
    handleSaveToGoogleCalendar : (semStartDate : Date) => void;
    handleClose : () => void;
}

export class GetSemStartDateDialog extends React.Component < IGetSemStartDateDialogProps,
IGetSemStartDateDialogState > {
    public constructor(props) {
        super(props);
        this.state = {
            date: null,
            dateIsSelected: false
        };
    }

    public handleDateChanged = (dates : Date[]) => {
        this.setState({date: dates[0], dateIsSelected: true});
    }

    public render() {
        const flatpickerOptions = {
            altInput: true,
            disable: [(date) => {
                    // disable date that are not Monday
                    return (date.getDay() !== 1);
                }
            ]
        };

        const buttonStyle : React.CSSProperties = {
            marginRight: "10px"
        };
        return (
            <Dialog open={this.props.isOpen}>
                <DialogTitle>Pick a date that represent the
                    <br/>
                    Monday of Week One of next semester.</DialogTitle>
                <div>
                    <StackPanel orientation="vertical" horizontalAlignment="center">
                        <Flatpickr
                            placeholder="Pick date . . ."
                            options={flatpickerOptions}
                            onChange={this.handleDateChanged}/> {""}
                    </StackPanel>
                    <StackPanel
                        style={{
                        margin: "10px"
                    }}
                        orientation="horizontal"
                        horizontalAlignment="right">
                        <Button style={buttonStyle} onClick={this.props.handleClose}>Cancel</Button>
                        <Button
                            onClick={() => this.props.handleSaveToGoogleCalendar(this.state.date)}
                            style={buttonStyle}
                            disabled={!this.state.dateIsSelected}
                            raised={true}
                            color="primary">Add to Google Calendar</Button>
                    </StackPanel>
                </div>
            </Dialog>
        );
    }
}
