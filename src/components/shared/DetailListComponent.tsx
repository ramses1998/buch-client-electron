import React, { ReactNode } from "react";
import {
    Box,
    List,
    ListDivider,
    ListItem,
    ListItemDecorator,
    Stack,
    Typography,
} from "@mui/joy";

type GroupItem = {
    icon: ReactNode;
    label: string;
    value: ReactNode;
};

// Generic T muss angegeben werden, um ein Objekt dieses Typen zu erstellen.
// Der generische Typ nimmt nur strings-Typen oder Union-Typen an
export type Group<T extends string> = {
    name: T;
    items: GroupItem[];
};

type PropsDetailsList<T extends string> = {
    groups: Group<T>[];
};

//
export const DetailsListComponent = <U extends string>(
    props: PropsDetailsList<U>,
) => {
    const { groups } = props;

    return (
        <Stack spacing={"var(--gap-3)"} sx={{ width: "100%" }}>
            {groups.map((group) => (
                <Box key={group.name}>
                    <Typography
                        level="body-md"
                        sx={{ mb: 2, ml: 2, color: "grey" }}
                    >
                        {group.name}
                    </Typography>
                    <List
                        variant="outlined"
                        sx={{
                            borderRadius: "md",
                            width: "100%",
                            backgroundColor: "white",
                        }}
                    >
                        {group.items.map((item, index) => (
                            <React.Fragment key={item.label}>
                                <ListItem
                                    endAction={<Box>{item.value}</Box>}
                                    sx={{ ml: 1, mr: 3 }}
                                >
                                    <ListItemDecorator>
                                        {item.icon}
                                    </ListItemDecorator>
                                    {item.label}
                                </ListItem>
                                {index !== group.items.length - 1 ? (
                                    <ListDivider />
                                ) : null}
                            </React.Fragment>
                        ))}
                    </List>
                </Box>
            ))}
        </Stack>
    );
};
