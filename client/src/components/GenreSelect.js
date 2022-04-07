import React,{ useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { MenuItem, FormControl, Select, Chip, InputLabel, OutlinedInput, Box, FormHelperText } from '@mui/material';

 // some styles
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


function getStyles(name, genre, theme) {
  return {
    fontWeight:
    genre.indexOf(name) === -1
    ? theme.typography.fontWeightRegular
    : theme.typography.fontWeightMedium,
  };
}

const genres = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Fantasy',
  'Historical',
  'Horror',
  'Romance',
  'Thriller',
  'Western'
];

const GenreSelect = ({isError,selectedValues,toEditGenres}) => {

  const theme = useTheme();
  const [genreValue, setGenreValue] = useState(toEditGenres ? toEditGenres : []);

    const handleChange = (event) => {
        const { target: { value },} = event;
        setGenreValue(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
        );
    }

    useEffect(()=>{
        selectedValues(genreValue)
    },[genreValue])
  return (
    <div>
      <FormControl sx={{ width: "100%" }}>
        <InputLabel error={(isError == true && genreValue == "")} id="demo-multiple-chip-label">Genres</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          error={(isError == true && genreValue == "")}
          value={genreValue}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Genres" />}
          renderValue={(selected) => {
            return (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )
          }}
          MenuProps={MenuProps}
        >
          {genres.map((genre) => (
            <MenuItem
              key={genre}
              value={genre}
              style={getStyles(genre, genreValue, theme)}
            >
              {genre}
            </MenuItem>
          ))}
        </Select>
        {
          (isError == true && genreValue == "") ? <FormHelperText error={(isError == true && genreValue == "")}>This field is required.</FormHelperText> : null
        }
      </FormControl>
    </div>
  );
}

export default GenreSelect