const User  = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');


const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      // if .user has been added to req by authMiddleware, user is validated
      if (context.user) {
        const userData = await User.findOne({_id: context.user._id})
          .select('-__v -password')
          // not sure what to populate...check front end.  need savedBooks array from User to map over for component
          .populate('savedBooks')

        return userData;
      }

      throw new AuthenticationError('Not logged in');
    }
  }
}