import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import api from '../../services/api';
import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  LoadingView,
  ErrorView,
  ErrorName,
  ErrorMessage,
  ReloadRefresh,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  constructor() {
    super();
    this.state = {
      stars: [],
      page: 1,
      loading: false,
      error: null,
    };
  }

  async componentDidMount() {
    this.loadStarreds();
  }

  loadStarreds = async () => {
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    const { stars, page } = this.state;

    this.setState({ loading: true });

    await api
      .get(`users/${user.login}/starred?page=${page}`)
      .then(response => {
        this.setState({
          stars: [...stars, ...response.data],
          page: page + 1,
          loading: false,
          error: null,
        });
      })
      .catch(error => {
        this.setState({ loading: false, error });
      });
  };

  renderFooter = () => {
    const { loading } = this.state;

    if (!loading) return null;
    return (
      <LoadingView>
        <ActivityIndicator />
      </LoadingView>
    );
  };

  handleRefresh = () => {
    this.loadStarreds();
  };

  render() {
    const { navigation } = this.props;
    const { stars, error, loading } = this.state;

    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {error ? (
          <ErrorView>
            <ErrorName>{error.name}</ErrorName>
            <ErrorMessage>{error.message}</ErrorMessage>
            <ReloadRefresh loading={loading} onPress={this.handleRefresh}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Icon name="refresh" size={20} color="#FFF" />
              )}
            </ReloadRefresh>
          </ErrorView>
        ) : (
          <Stars
            data={stars}
            keyExtractor={star => String(star.id)}
            onEndReached={this.loadStarreds}
            onEndReachedThreshold={0.1}
            ListFooterComponent={this.renderFooter}
            renderItem={({ item }) => (
              <Starred>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}

User.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
};
