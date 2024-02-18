"use client";
import React, {ReactNode} from "react";
import {useApplicationContextApi} from "@/context/ApplicationContextApi";
import useSWR from "swr";
import {Buch} from "@/api/buch";
import {LoadingComponent} from "@/components/shared/LoadingComponent";
import Alert from "@mui/material/Alert";
import {Box, Button, List, ListDivider, ListItem, ListItemDecorator, Stack, Typography,} from "@mui/joy";
import {useParams} from "next/navigation";
import {PageWrapperComponent} from "@/components/shared/PageWrapperComponent";
import {BookCardComponent} from "@/components/shared/BookCardComponent";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import GradeOutlinedIcon from "@mui/icons-material/GradeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import EuroOutlinedIcon from "@mui/icons-material/EuroOutlined";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";
import ImportContactsOutlinedIcon from "@mui/icons-material/ImportContactsOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import {RatingComponent} from "@/components/shared/RatingComponent";
import {CustomBadgeComponent} from "@/components/shared/CustomBadgeComponent";
import {useMediaQuery} from "@/hooks/useMediaQuery";

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const appContext = useApplicationContextApi();

  const {
    data: buch,
    isLoading,
    error,
  } = useSWR<Buch>("getById", () => appContext.getBuchById(parseInt(id)), {
    revalidateOnMount: true,
  });

  const { isSmall } = useMediaQuery();

  if (isLoading || buch === undefined)
    return <LoadingComponent message="Bücher werden geladen..." />;

  if (error) {
    return (
        <Alert severity="error">
          Ein Fehler ist aufgetreten: {(error as Error).toString()}
        </Alert>
    );
  }

  return (
      <PageWrapperComponent title={"Buchdetails"}>
        <Stack direction={isSmall ? "column" : "row"} spacing={"var(--gap-5)"}>
          <Stack spacing={"var(--gap-4)"}>
            <BookCardComponent buch={buch} />
            <Stack spacing={"var(--gap-1)"} justifyItems={"center"}>
              <Button>Bearbeiten</Button>
              <Button color="danger">Löschen</Button>
            </Stack>
          </Stack>
          <Stack spacing={"var(--gap-3)"} sx={{ width: "100%" }}>
            <DetailsListComponent buch={buch} />
          </Stack>
        </Stack>
      </PageWrapperComponent>
  );
};

type GroupName = "Über das Buch" | "Author" | "Lieferung" | "Sonstiges";

type GroupItem = {
  icon: ReactNode;
  label: string;
  value: ReactNode;
};

type Group = {
  name: GroupName;
  items: GroupItem[];
};

type PropsDetailsList = {
  buch: Buch;
};
const DetailsListComponent: React.FC<PropsDetailsList> = (
    props: PropsDetailsList,
) => {
  const { buch } = props;

  const aboutBookGroup: Group = {
    name: "Über das Buch",
    items: [
      {
        icon: <NumbersOutlinedIcon fontSize="small" />,
        label: "ISBN",
        value: buch.isbn,
      },
      {
        icon: <GradeOutlinedIcon fontSize="small" />,
        label: "Bewertung",
        value: <RatingComponent stars={buch.rating} />,
      },
      {
        icon: <CalendarMonthOutlinedIcon fontSize="small" />,
        label: "Erscheinungsdatum",
        value: new Intl.DateTimeFormat("de-DE", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(buch.datum),
      },
    ],
  };

  const authorGroup: Group = {
    name: "Author",
    items: [
      {
        icon: <LanguageOutlinedIcon fontSize="small" />,
        label: "Homepage",
        value: buch.homepage,
      },
    ],
  };

  const deliveryGroup: Group = {
    name: "Lieferung",
    items: [
      {
        icon: <EuroOutlinedIcon fontSize="small" />,
        label: "Preis",
        value: `${buch.preis} €`,
      },
      {
        icon: <PercentOutlinedIcon fontSize="small" />,
        label: "Rabatt",
        value: buch.rabatt,
      },
      {
        icon: <ImportContactsOutlinedIcon fontSize="small" />,
        label: "Art",
        value: buch.art,
      },
      {
        icon: <LocalShippingOutlinedIcon fontSize="small" />,
        label: "Lieferbar",
        value: buch.lieferbar ? "Lieferbar" : "Nicht lieferbar",
      },
    ],
  };

  const othersGroup: Group = {
    name: "Sonstiges",
    items: [
      {
        icon: <VpnKeyOutlinedIcon fontSize="small" />,
        label: "Schlagwörter",
        value: (
            <Stack direction="row" spacing={"var(--gap-1)"}>
              {buch.schlagwoerter?.map((w) => (
                  <CustomBadgeComponent key={w} value={w} />
              ))}
            </Stack>
        ),
      },
    ],
  };

  const allGroups: Group[] = [
    aboutBookGroup,
    authorGroup,
    deliveryGroup,
    othersGroup,
  ];

  return (
      <Stack spacing={"var(--gap-3)"} sx={{ width: "100%" }}>
        {allGroups.map((group) => (
            <Box key={group.name}>
              <Typography level="body-md" sx={{ mb: 2, ml: 2, color: "grey" }}>
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
                        <ListItemDecorator>{item.icon}</ListItemDecorator>
                        {item.label}
                      </ListItem>
                      {index !== group.items.length - 1 ? <ListDivider /> : null}
                    </React.Fragment>
                ))}
              </List>
            </Box>
        ))}
      </Stack>
  );
};

export default BookDetailPage;
