"use client";
import Image from "next/image";
import { data } from "@/data/data";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import { Box, Button, Container, Grid } from "@mui/material";

export default function Home() {
  const [filter, setFilter] = useState<string>("all");
  return (
    <Box margin="4rem">
      <Container>
        <Grid container spacing={2}>
          <Grid xs={8}>
            <Box>
              <Stack direction="row" spacing={1}>
                <Chip
                  label="All"
                  onClick={() => {
                    setFilter("all");
                  }}
                  variant="outlined"
                  color={filter === "all" ? "info" : "default"}
                ></Chip>
                {data.labels.map((label) => {
                  return (
                    <Chip
                      label={label.label}
                      onClick={() => {
                        setFilter(label.id);
                      }}
                      variant="outlined"
                      color={filter === label.id ? "info" : "default"}
                    />
                  );
                })}
              </Stack>
            </Box>
            <Box>
              <Grid container spacing={4} padding={8}>
                {data.meals
                  .filter((meal) =>
                    filter === "all" ? true : meal.labels.includes(filter)
                  )
                  .map((meal) => (
                    <Meal meal={meal}></Meal>
                  ))}
              </Grid>
            </Box>
          </Grid>
          <Grid xs={4}>
            <Box>Hi</Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function Meal({ meal }: { meal: (typeof data.meals)[0] }) {
  const [selectedDrink, setDrink] = useState<string>("drink-1");
  return (
    <>
      <Grid key={meal.id} item xs={4} height={200}>
        <img
          src={meal.img}
          alt={meal.id}
          style={{
            objectFit: "cover",
            height: "100%",
            width: "100%",
          }}
        />
      </Grid>
      <Grid xs={6} padding={4} display={"flex"} flexDirection={"column"}>
        <text>
          {meal.title} + {meal.drinks.length} drinks
        </text>
        <text>Name of the meal</text>
        <text>Starter: {meal.starter}</text>
        <text>Dessert: {meal.desert}</text>
        <text>
          Selected drink:{" "}
          {meal.drinks.find((drink) => drink.id === selectedDrink)?.title ||
            "Not Found"}
        </text>
        <Box gap={3} display={"flex"}>
          <Grid gap={1} display={"flex"}>
            {meal.drinks.map((drink) => {
              return (
                <Grid>
                  <Chip
                    label={drink.title}
                    onClick={() => {
                      setDrink(drink.id);
                    }}
                    variant="outlined"
                    color={selectedDrink === drink.id ? "info" : "default"}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Grid>
      <Grid gap={3} display={"flex"} flexDirection={"column"} alignItems={"end"} justifyContent={"end"} xs={2}>
        <text>
          Price:{" "}
          {(
            meal.price +
            meal.drinks.find((drink) => drink.id === selectedDrink)?.price!
          ).toPrecision(4)}
        </text>
        <Button variant="outlined">Select </Button>
      </Grid>
    </>
  );
}
