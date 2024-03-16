"use client";
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { ChangeEvent, useEffect, useState } from "react";
import { PageWrapperComponent } from "@/components/shared/PageWrapperComponent";
import {
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    IconButton,
    Input,
    Typography,
} from "@mui/joy";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import styled from "styled-components";
import { LoginDaten } from "@/api/auth";
import Alert from "@mui/material/Alert";
import {
    DetailsListComponent,
    Group,
} from "@/components/shared/DetailListComponent";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import LockClockOutlinedIcon from "@mui/icons-material/LockClockOutlined";
import { useAuthContext } from "@/context/AuthContextApi";
import { UNIX_TIME_TO_JAVASCRIPT_TIME_FACTOR } from "@/context/ApplicationContextApi";
import {
    Mitteilung,
    useMitteilungContext,
} from "@/context/NotificationContextApi";
import { v4 as uuid } from "uuid";

type GroupName = "Benutzer Info" | "Konto";

/**
 * React-Komponente für die Login-Seite.
 */
const LoginPage: React.FC = () => {
    const authContext = useAuthContext();
    const mitteilungContext = useMitteilungContext();

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [error, setError] = useState<Error | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [sessionState, setSessionState] = useState<string | undefined>(
        undefined,
    );
    const [accessTokenExpiryDate, setAccessTokenExpiryDate] = useState<
        Date | undefined
    >(undefined);
    const [loginDaten, setLoginDaten] = useState<LoginDaten>({
        username: "",
        password: "",
    });

    /**
     * Funktion zum Auslösen einer Mitteilung nach erfolgreicher Anmeldung.
     *
     */
    const mitteilungAusloesen = () => {
        const neuMitteilung: Mitteilung = {
            id: uuid(),
            title: "Erfolgreiche Anmeldung",
            description: "Du hast dich angemeldet",
            seen: false,
            creationTimeStamp: new Date().toISOString(),
        };
        mitteilungContext.triggerMitteilung(neuMitteilung);
    };

    /**
     * Aktualisieren des Session-States und Ablaufdatums des Access Tokens
     * basierend auf dem Auth-Objekt des AuthContexts.
     */
    useEffect(() => {
        if (!authContext.auth) return;
        const sessionState = authContext.auth.session_state;
        const authExpiryIn = authContext.auth.expires_in;

        if (!sessionState || !authExpiryIn) {
            console.error(
                "Session_state und expires konnten nicht gelesen werden!",
            );
            return;
        }
        setSessionState(sessionState);
        const currentDate = new Date();
        const expiryDate = new Date(
            currentDate.getTime() +
                authExpiryIn * UNIX_TIME_TO_JAVASCRIPT_TIME_FACTOR,
        );

        setAccessTokenExpiryDate(expiryDate);
    }, [authContext.auth]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setLoginDaten((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value,
        }));
    };

    const handleLogin = async () => {
        setIsLoading(true);
        setError(undefined);
        try {
            await authContext.login(loginDaten);
            setLoginDaten({ username: "", password: "" });
            mitteilungAusloesen();
        } catch (err) {
            console.error(err);
            setError(
                new Error(
                    "Die Anmeldung ist fehlgeschlagen!. Überprüfe deine Eingaben nochmal.",
                    { cause: err },
                ),
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword((prevState) => !prevState);
    };

    const userInfoGroups: Group<GroupName>[] = [
        {
            name: "Benutzer Info",
            items: [
                {
                    icon: <NumbersOutlinedIcon fontSize="small" />,
                    label: "Session State",
                    value: sessionState,
                },
                {
                    icon: <LockClockOutlinedIcon fontSize="small" />,
                    label: "Ablaufdatum der Anmeldung",
                    value: accessTokenExpiryDate?.toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        timeZone: "Europe/Berlin",
                    }),
                },
            ],
        },
    ];

    const passwordVisibilityIcon = showPassword ? (
        <IconButton onClick={handleClickShowPassword}>
            <VisibilityOutlinedIcon fontSize="small" />
        </IconButton>
    ) : (
        <IconButton onClick={handleClickShowPassword}>
            <VisibilityOffOutlinedIcon fontSize="small" />
        </IconButton>
    );

    return (
        <PageWrapperComponent>
            <FieldListWrapper>
                {authContext.auth ? (
                    <UserInfoComponent
                        userInfoGroups={userInfoGroups}
                        handleLogout={authContext.logout}
                    />
                ) : (
                    <FieldListContainer>
                        <CardTitle level="h3">Anmeldung</CardTitle>
                        <Input
                            key={1}
                            value={loginDaten.username}
                            name="username"
                            placeholder="Benutzername"
                            size="lg"
                            onChange={handleChange}
                            startDecorator={
                                <AccountCircleOutlinedIcon fontSize="small" />
                            }
                        />
                        <Input
                            key={2}
                            placeholder="Passwort"
                            value={loginDaten.password}
                            name="password"
                            size="lg"
                            onChange={handleChange}
                            type={showPassword ? "text" : "password"}
                            endDecorator={passwordVisibilityIcon}
                            startDecorator={
                                <VpnKeyOutlinedIcon fontSize="small" />
                            }
                        />
                        {error ? (
                            <Alert severity="error">{error.message}</Alert>
                        ) : null}
                        <Button
                            loading={isLoading}
                            loadingPosition="start"
                            disabled={
                                loginDaten.username.length === 0 ||
                                loginDaten.password.length === 0
                            }
                            onClick={handleLogin}
                        >
                            Anmelden
                        </Button>
                    </FieldListContainer>
                )}
            </FieldListWrapper>
        </PageWrapperComponent>
    );
};

type PropsUserInfo = {
    userInfoGroups: Group<GroupName>[];
    handleLogout: () => void;
};
const UserInfoComponent: React.FC<PropsUserInfo> = (props: PropsUserInfo) => {
    const { userInfoGroups, handleLogout } = props;
    return (
        <Box
            sx={{
                display: "grid",
                gridGap: "var(--gap-3)",
                width: "100%",
            }}
        >
            <Box
                sx={{
                    display: "grid",
                    justifyItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                }}
            >
                <Badge
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                    }}
                    badgeInset="14%"
                    color="primary"
                >
                    <Avatar
                        sx={{
                            width: "100px",
                            height: "100px",
                            border: "4px solid white",
                        }}
                    />
                </Badge>
                <Typography
                    level="title-md"
                    sx={{ my: "var(--gap-2)" }}
                    color="primary"
                >
                    Erfolgreich angemeldet
                </Typography>
                <Button variant="solid" color="danger" onClick={handleLogout}>
                    Abmelden
                </Button>
            </Box>
            <DetailsListComponent groups={userInfoGroups} />
        </Box>
    );
};

const FieldListWrapper = styled(Box)`
    display: grid;
`;

const FieldListContainer = styled(Card)`
    display: grid;
    grid-gap: var(--gap-2);
    justify-self: center;
    max-width: 500px;
    min-width: 500px;
    padding: var(--gap-4) var(--gap-2);

    @media screen and (max-width: 900px) {
        min-width: unset;
    }
`;

const CardTitle = styled(Typography)`
    text-align: center;
    margin-bottom: var(--gap-3);
`;

export default LoginPage;
