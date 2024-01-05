"use client";
import Image from "next/image";
import { atom, useAtom } from "jotai"; //atomic state manager, to avoid propdrilling
import Pagination from "@mui/material/Pagination";

import Divider from "@mui/material/Divider";
import { data } from "@/data/data";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { useState, useEffect } from "react";

import {
  Box,
  Container,
  Grid,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { orderAtom, passengerAtom } from "@/lib/state";
import { Meal } from "./Meal";

export default function Home() {
  const [filter, setFilter] = useState<string>("all");
  const [passengerOrder, setPassengerOrder] = useAtom(orderAtom);
  const [selectedPassenger, setPassenger] = useAtom(passengerAtom);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const mealsPerPage: number = 3;

  const calculateTotalPrice = () => {
    let total = 0;
    passengerOrder.forEach((passenger) => {
      if (passenger.meal) {
        total += passenger.meal.price;
      }
    });
    setTotalPrice(total);
  };
  useEffect(() => {
    calculateTotalPrice(); // Calculate total price when passengerOrder changes
  }, [passengerOrder]);

  const filteredMeals = data.meals.filter((meal) =>
    filter === "all" ? true : meal.labels.includes(filter)
  );

  const indexOfFirstMeal = (currentPage - 1) * mealsPerPage;
  const indexOfLastMeal = currentPage * mealsPerPage;

  const currentMeals = filteredMeals.slice(
    indexOfFirstMeal,
    Math.min(indexOfLastMeal, filteredMeals.length)
  );

  const totalMeals = filteredMeals.length;

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Box
      padding={{ xs: "1rem", md: "4rem" }}
      sx={{ bgcolor: "#424242" }}
      minHeight={"100vh"}
    >
      <Container>
        <Grid
          container
          gap={2}
          display={"flex"}
          flexDirection={{ md: "row", xs: "column-reverse" }}
          width={"100%"}
        >
          <Grid
            gap={2}
            display={"flex"}
            flexDirection={"column"}
            width={{ xs: "100%", md: "70%" }}
          >
            {/* {Filters(setFilter, setCurrentPage, filter)} */}
            <Filters
              filter={filter}
              setCurrentPage={setCurrentPage}
              setFilter={setFilter}
            ></Filters>
            <Box>
              <Grid container gap={2}>
                {currentMeals.map((meal) => (
                  <Meal meal={meal} key={meal.id}></Meal>
                ))}
              </Grid>
              {totalMeals > mealsPerPage && (
                <Box
                  mt={3}
                  display="flex"
                  justifyContent="center"
                  color={"white"}
                  width={"100%"}
                >
                  <Pagination
                    count={Math.ceil(totalMeals / mealsPerPage)}
                    page={currentPage}
                    onChange={(event, page) => paginate(page)}
                    sx={{
                      bgcolor: "white",
                      color: "white",
                      padding: 2,
                      borderRadius: "0.5rem",
                    }}
                    color="secondary"
                    size="large"
                  />
                </Box>
              )}
            </Box>
          </Grid>

          <Grid
            // xs={3}
            sx={{ bgcolor: "white", borderRadius: "0.5rem", flexGrow: 1 }}
            padding={4}
            flexGrow="initial"
            maxWidth={"100%"}
          >
            <List>
              {passengerOrder
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((passenger) => {
                  return (
                    <ListItemButton
                      key={passenger.name}
                      selected={selectedPassenger === passenger.name}
                      onClick={() => setPassenger(passenger.name)}
                    >
                      {/* <ListItemText primary={passenger.name} /> */}
                      <Box justifyContent={"space-between"}>
                        <Box>{passenger.name}</Box>
                        <Box>
                          {passenger.meal ? "Meal selected" : "Not selected"}
                        </Box>
                        <Box>Price:{passenger.meal?.price.toFixed(2)}</Box>
                      </Box>
                    </ListItemButton>
                  );
                })}
            </List>
            <Box textAlign="right" mt={2}>
              <strong>Total Price: {totalPrice.toFixed(2)}</strong>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
function Filters({
  setFilter,
  setCurrentPage,
  filter,
}: {
  setFilter: (filter: string) => void;
  setCurrentPage: (page: number) => void;
  filter: string;
}) {
  return (
    <Box padding={2} sx={{ bgcolor: "white", borderRadius: "0.5rem" }}>
      <Stack direction="row" gap={1} flexWrap={"wrap"}>
        <Chip
          label="All"
          onClick={() => {
            setFilter("all");
            setCurrentPage(1);
          }}
          variant="outlined"
          color={filter === "all" ? "info" : "default"}
        ></Chip>

        {data.labels.map((label) => {
          return (
            <Chip
              key={label.id}
              label={label.label}
              onClick={() => {
                setFilter(label.id);
                setCurrentPage(1);
              }}
              variant="outlined"
              color={filter === label.id ? "info" : "default"}
            />
          );
        })}
      </Stack>
    </Box>
  );
}
