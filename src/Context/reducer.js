const reducer = (state, action) => {
  switch (action.type) {
    case "ADD TO FAVOURITE":
      return {
        ...state,
        Favourite: [...state.Favourite, action.payload]
      };

    case "CREATE YOUR OWN BLOG":
      return {
        ...state,
        blogs: [...state.blogs, action.payload]
      };

    case "SAVE BLOG":
      return {
        ...state,
        blogs: [
          ...state.blogs.map((blog) => {
            if (blog.id === action.payload.id) {
              return {
                ...blog,
                title: action.payload.title,
                content: action.payload.content,
                image: action.payload.image
              };
            }
            return blog;
          })
        ],
        Favourite: [
          ...state.Favourite.map((blog) => {
            if (blog.id === action.payload.id) {
              return {
                ...blog,
                title: action.payload.title,
                content: action.payload.content,
                image: action.payload.image
              };
            }
            return blog;
          })
        ]
      };

    case "REMOVE FROM BLOGS":
      return {
        ...state,
        blogs: state.blogs.filter((b) => b.id !== action.payload.id),
        Favourite: state.Favourite.filter((b) => b.id !== action.payload.id)
      };

    case "REMOVE FROM FAVOURITE":
      return {
        ...state,
        Favourite: state.Favourite.filter((b) => b.id !== action.payload.id)
      };

    case "EDIT PROFILE":
      return {
        ...state,
        blogs: [
          ...state.blogs.map((blog) => {
            if (blog.userId === action.payload.userId) {
              return {
                ...blog,
                userName: action.payload.userName,
                userStatus: action.payload.userStatus,
                userAvatar: action.payload.userAvatar
              };
            }
            return blog;
          })
        ]
      };
    default:
      return state;
  }
};
export default reducer;
