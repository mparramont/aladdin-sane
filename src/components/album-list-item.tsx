import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
  useTheme
} from '@mui/material'
import { Link } from 'react-router-dom'

function AlbumListItem({ album }: { album: TopAlbum }) {
  const theme = useTheme()
  const { id, name, favorite, image } = album

  const albumCover = image?.find((img) => img.size === 'small')?.['#text'] || ''

  // TODO fetch the LastFMAlbum, and get the year from there (n+1 query issue though)
  const year = name.match(/\d{4}/)?.[0] || ''

  return (
    <ListItem
      component={Link}
      to={`albums/${id}`}
      sx={{
        textDecoration: 'none',
        color: theme.palette.primary.main
      }}
    >
      <ListItemAvatar>
        <Avatar src={albumCover} alt={`${name} album cover`} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
          >
            <Typography>{name || <i>No Name</i>}</Typography>
            <Typography variant="caption" color="text.secondary">
              {favorite ? <StarIcon /> : <StarBorderIcon />}
            </Typography>
          </Stack>
        }
        secondary={year}
      />
    </ListItem>
  )
}

export default AlbumListItem
