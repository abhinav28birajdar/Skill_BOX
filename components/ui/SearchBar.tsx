import { useTheme } from '@/constants/Theme';
import React, { useState } from 'react';
import {
    FlatList,
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';

interface SearchBarProps extends Omit<TextInputProps, 'style'> {
  style?: ViewStyle;
  variant?: 'default' | 'outline' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  showSearchIcon?: boolean;
  showClearButton?: boolean;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  suggestions?: string[];
  showSuggestions?: boolean;
  renderSuggestion?: (item: string, index: number) => React.ReactNode;
  maxSuggestions?: number;
  debounceMs?: number;
}

interface SearchWithFiltersProps extends SearchBarProps {
  filters?: SearchFilter[];
  activeFilters?: string[];
  onFilterChange?: (filters: string[]) => void;
  showFilterChips?: boolean;
}

interface SearchFilter {
  id: string;
  label: string;
  type: 'category' | 'level' | 'price' | 'rating' | 'duration';
  options?: string[];
}

export function SearchBar({
  style,
  variant = 'default',
  size = 'md',
  showSearchIcon = true,
  showClearButton = true,
  onSearch,
  onClear,
  suggestions = [],
  showSuggestions = false,
  renderSuggestion,
  maxSuggestions = 5,
  debounceMs = 300,
  value: controlledValue,
  onChangeText: controlledOnChangeText,
  placeholder = 'Search...',
  ...props
}: SearchBarProps) {
  const theme = useTheme();
  const [internalValue, setInternalValue] = useState('');
  const [showSuggestionList, setShowSuggestionList] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<number | null>(null);

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  
  const handleChangeText = (text: string) => {
    if (controlledOnChangeText) {
      controlledOnChangeText(text);
    } else {
      setInternalValue(text);
    }

    // Show/hide suggestions
    setShowSuggestionList(text.length > 0 && showSuggestions);

    // Debounced search
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    if (onSearch && debounceMs > 0) {
      const timer = setTimeout(() => {
        onSearch(text);
      }, debounceMs);
      setDebounceTimer(timer as any);
    } else if (onSearch) {
      onSearch(text);
    }
  };

  const handleClear = () => {
    const newValue = '';
    if (controlledOnChangeText) {
      controlledOnChangeText(newValue);
    } else {
      setInternalValue(newValue);
    }
    setShowSuggestionList(false);
    if (onClear) {
      onClear();
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    if (controlledOnChangeText) {
      controlledOnChangeText(suggestion);
    } else {
      setInternalValue(suggestion);
    }
    setShowSuggestionList(false);
    if (onSearch) {
      onSearch(suggestion);
    }
  };

  const sizes = {
    sm: { height: 36, fontSize: theme.typography.fontSize.sm, padding: theme.spacing.sm },
    md: { height: 44, fontSize: theme.typography.fontSize.base, padding: theme.spacing.md },
    lg: { height: 52, fontSize: theme.typography.fontSize.lg, padding: theme.spacing.lg },
  };

  const variants = {
    default: {
      backgroundColor: theme.colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    filled: {
      backgroundColor: theme.colors.surface,
      borderWidth: 0,
      borderColor: 'transparent',
    },
  };

  const filteredSuggestions = suggestions
    .filter(suggestion => 
      suggestion.toLowerCase().includes(value.toLowerCase())
    )
    .slice(0, maxSuggestions);

  return (
    <View style={style}>
      <View style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          height: sizes[size].height,
          borderRadius: theme.borderRadius.lg,
          paddingHorizontal: sizes[size].padding,
        },
        variants[variant],
      ]}>
        {/* Search Icon */}
        {showSearchIcon && (
          <View style={{
            marginRight: theme.spacing.sm,
          }}>
            <Text style={{
              fontSize: sizes[size].fontSize,
              color: theme.colors.textSecondary,
            }}>
              🔍
            </Text>
          </View>
        )}

        {/* Text Input */}
        <TextInput
          style={{
            flex: 1,
            fontSize: sizes[size].fontSize,
            color: theme.colors.text,
            height: '100%',
          }}
          value={value}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          onFocus={() => setShowSuggestionList(value.length > 0 && showSuggestions)}
          onBlur={() => setTimeout(() => setShowSuggestionList(false), 150)}
          {...props}
        />

        {/* Clear Button */}
        {showClearButton && value.length > 0 && (
          <TouchableOpacity
            onPress={handleClear}
            style={{
              marginLeft: theme.spacing.sm,
              padding: theme.spacing.xs,
            }}
          >
            <Text style={{
              fontSize: sizes[size].fontSize,
              color: theme.colors.textSecondary,
            }}>
              ✕
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Suggestions List */}
      {showSuggestionList && filteredSuggestions.length > 0 && (
        <View style={{
          marginTop: theme.spacing.xs,
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.md,
          borderWidth: 1,
          borderColor: theme.colors.border,
          maxHeight: 200,
          ...theme.shadows.md,
        }}>
          <FlatList
            data={filteredSuggestions}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item, index }) => (
              renderSuggestion ? (
                <TouchableOpacity onPress={() => handleSuggestionPress(item)}>
                  {renderSuggestion(item, index)}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => handleSuggestionPress(item)}
                  style={{
                    padding: theme.spacing.md,
                    borderBottomWidth: index < filteredSuggestions.length - 1 ? 1 : 0,
                    borderBottomColor: theme.colors.border,
                  }}
                >
                  <Text style={{
                    fontSize: theme.typography.fontSize.base,
                    color: theme.colors.text,
                  }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
}

// Filter Chip Component
interface FilterChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
  onRemove?: () => void;
  removable?: boolean;
  style?: ViewStyle;
}

export function FilterChip({
  label,
  active = false,
  onPress,
  onRemove,
  removable = false,
  style,
}: FilterChipProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          borderRadius: theme.borderRadius.full,
          borderWidth: 1,
          borderColor: active ? theme.colors.primary : theme.colors.border,
          backgroundColor: active ? theme.colors.primary : 'transparent',
          marginRight: theme.spacing.sm,
          marginBottom: theme.spacing.sm,
        },
        style,
      ]}
    >
      <Text style={{
        fontSize: theme.typography.fontSize.sm,
        color: active ? '#FFFFFF' : theme.colors.text,
        fontWeight: active ? '600' : '400',
      }}>
        {label}
      </Text>
      
      {removable && (
        <TouchableOpacity
          onPress={onRemove}
          style={{
            marginLeft: theme.spacing.sm,
            width: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: active ? 'rgba(255,255,255,0.3)' : theme.colors.border,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{
            fontSize: 10,
            color: active ? '#FFFFFF' : theme.colors.textSecondary,
            fontWeight: 'bold',
          }}>
            ✕
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

// Search with Filters Component
export function SearchWithFilters({
  filters = [],
  activeFilters = [],
  onFilterChange,
  showFilterChips = true,
  ...searchProps
}: SearchWithFiltersProps) {
  const theme = useTheme();
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterToggle = (filterId: string) => {
    const newFilters = activeFilters.includes(filterId)
      ? activeFilters.filter(id => id !== filterId)
      : [...activeFilters, filterId];
    
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleFilterRemove = (filterId: string) => {
    const newFilters = activeFilters.filter(id => id !== filterId);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const clearAllFilters = () => {
    if (onFilterChange) {
      onFilterChange([]);
    }
  };

  return (
    <View style={searchProps.style}>
      {/* Search Bar */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <SearchBar {...searchProps} style={undefined} />
        </View>
        
        {/* Filter Toggle Button */}
        {filters.length > 0 && (
          <TouchableOpacity
            onPress={() => setShowFilters(!showFilters)}
            style={{
              marginLeft: theme.spacing.sm,
              padding: theme.spacing.md,
              backgroundColor: showFilters ? theme.colors.primary : theme.colors.surface,
              borderRadius: theme.borderRadius.md,
              borderWidth: 1,
              borderColor: theme.colors.border,
            }}
          >
            <Text style={{
              fontSize: theme.typography.fontSize.base,
              color: showFilters ? '#FFFFFF' : theme.colors.text,
            }}>
              ⚡
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Active Filters */}
      {showFilterChips && activeFilters.length > 0 && (
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginTop: theme.spacing.md,
          alignItems: 'center',
        }}>
          {activeFilters.map(filterId => {
            const filter = filters.find(f => f.id === filterId);
            return filter ? (
              <FilterChip
                key={filterId}
                label={filter.label}
                active={true}
                removable={true}
                onRemove={() => handleFilterRemove(filterId)}
              />
            ) : null;
          })}
          
          {activeFilters.length > 1 && (
            <TouchableOpacity onPress={clearAllFilters}>
              <Text style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.primary,
                fontWeight: '600',
              }}>
                Clear All
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Filter Options */}
      {showFilters && filters.length > 0 && (
        <View style={{
          marginTop: theme.spacing.md,
          padding: theme.spacing.md,
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.md,
          borderWidth: 1,
          borderColor: theme.colors.border,
        }}>
          <Text style={{
            fontSize: theme.typography.fontSize.base,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: theme.spacing.md,
          }}>
            Filters
          </Text>
          
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}>
            {filters.map(filter => (
              <FilterChip
                key={filter.id}
                label={filter.label}
                active={activeFilters.includes(filter.id)}
                onPress={() => handleFilterToggle(filter.id)}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
