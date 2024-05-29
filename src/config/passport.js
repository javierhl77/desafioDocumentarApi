
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const UserModel = require("../models/user.model");


passport.use("jwt", new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Utiliza ExtractJwt.fromExtractors para extraer el token de la cookie
    secretOrKey: "coderhouse"
}, async (jwt_payload, done) => {
    try {
        // Busca el usuario en la base de datos usando el ID del payload JWT
        const user = await UserModel.findById(jwt_payload.user._id);
        if (!user) {
            return done(null, false);
        }
        return done(null, user); // Devuelve el usuario encontrado
    } catch (error) {
        return done(error);
    }
}));


/* const cookieExtractor = (req) => {
let token = null;
if(req && req.cookies) {
    token = req.cookies["coderCookieToken"]
}
return token;
} */


/* const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "coderhouse"
};

passport.use(
  "jwt",
  new JwtStrategy(options, async (payload, done) => {
    try {
      const user = await UserModel.findById(payload.user._id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
); */


/*  passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  UserModel.findById(id, (err, user) => {
    done(err, user);
  });
}); */
 
module.exports = passport;