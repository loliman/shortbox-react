import {withContext} from "./generic";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import {Divider, Select} from "@material-ui/core";
import {generateUrl} from "../util/hierarchy";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import {ArrowDownward, ArrowUpward, ExpandLess, ExpandMore} from "@material-ui/icons";
import React from "react";

function SortContainer(props) {
    return (
        <div style={{alignSelf: "end"}}>
            <InputLabel style={{padding: 8,
                fontSize: 12}}>Sortieren</InputLabel>
            <div className={"sortContainer"}>
                <FormControl style={{alignSelf: "center"}} className={"field85"}>
                    <Select
                        disableUnderline
                        value={props.query && props.query.order ? props.query.order : "updatedAt"}
                        label="Sortieren"
                        onChange={e =>
                            props.navigate(e, generateUrl(props.selected, props.us),
                                {
                                    filter: props.query ? props.query.filter : null,
                                    order: e.target.value,
                                    direction: props.query ? props.query.direction : null,
                                })}>
                        <MenuItem value={"updatedAt"}>Änderungsdatum</MenuItem>
                        <MenuItem value={"createdAt"}>Erfassungsdatum</MenuItem>
                        <MenuItem value={"releasedate"}>Erscheinungsdatum</MenuItem>
                        <MenuItem value={"series"}>Serie</MenuItem>
                        <MenuItem value={"publisher"}>Verlag</MenuItem>
                    </Select>
                </FormControl>

                <Divider style={{width: 1, height: 26, margin: 4}} />

                <IconButton aria-label="Reihenfolge" style={{marginTop: '6px', height: '10px', width: '10px'}}
                            onMouseDown={(e) =>
                                props.navigate(e, generateUrl(props.selected, props.us),
                                    {
                                        filter: props.query ? props.query.filter : null,
                                        order: props.query ? props.query.order : null,
                                        direction: props.query && props.query.direction && props.query.direction !== 'DESC'? 'DESC' : 'ASC'
                                    })}>
                    {props.query && props.query.direction && props.query.direction !== 'DESC' ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
            </div>
        </div>
    )
}

export default withContext(SortContainer);