import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  useTheme
} from '@mui/material'
import { Link } from 'react-router-dom'

function AlbumListItem({ album }: { album: Album }) {
  const theme = useTheme()
  const { id, name, favorite, image, wiki } = album

  // Extract the album year from the wiki.summary
  const year = wiki?.summary.match(/\d{4}/)?.[0] || ''

  const albumCover = image?.find((img) => img.size === 'small')?.['#text'] || ''

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
          <>
            <Typography>{name || <i>No Name</i>}</Typography>
            <Typography variant="caption" color="text.secondary">
              {year}
            </Typography>
          </>
        }
        secondary={favorite && '‚òÖ'}
      />
    </ListItem>
  )
}

export default AlbumListItem
