import LottieView from 'lottie-react-native';
import HomeIcon from '../Lottie/Home.json';
import ProfileIcon from '../Lottie/Profile.json';
import SearchIcon from '../Lottie/Search.json';
import UploadIcon from '../Lottie/Upload.json';
import PropTypes from 'prop-types';

// icons used for bottom navigation.
const icons = {
  Home: HomeIcon,
  Profile: ProfileIcon,
  Upload: UploadIcon,
  Search: SearchIcon,
};

// This component is used to display icons and it's animation in bottom navigation.
const LottieIcons = ({iconName, focused}) => {
  return (
    <LottieView
      ref={(animation) => {
        if (animation && focused) {
          animation.play();
        }
      }}
      source={icons[iconName]}
      loop={false}
      autoPlay={false}
    />
  );
};

LottieIcons.propTypes = {
  iconName: PropTypes.string,
  focused: PropTypes.bool,
};

export default LottieIcons;
