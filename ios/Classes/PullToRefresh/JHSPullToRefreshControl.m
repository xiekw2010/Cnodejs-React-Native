//
//  JHSPullToRefreshView.m
//  PTR
//
//  Created by lamo on 14/12/18.
//  Copyright (c) 2014年 juhuasuan. All rights reserved.
//

#import "JHSPullToRefreshControl.h"
#import "JHSMagicLampPullToRefreshView.h"

#define KEY_PATH_CONTENT_OFFSET @"contentOffset"

/// OC类型的类型转换，_c_是要转换的类名，不可以为空
#define JHSObjectConvert(_c_, _o_)                      \
({                                                  \
NSObject* o = (_o_);                            \
if (o != nil) {                                 \
if (!o || ![o isKindOfClass:[_c_ class]]) { \
o = nil;                                \
}                                           \
}                                               \
(_c_*) o;                                       \
})

//_handler_不应该被执行，但是需要通过语法检查，避免在非DEBUG模式下因为语法问题编译不通过
#define JHSAssert(_condition_, _handler_) \
do {                                  \
assert(!!(_condition_));          \
if (NO) {                         \
_handler_;                    \
}                                 \
} while (0)


@interface JHSPullToRefreshControl ()

@property(nonatomic, assign) CFTimeInterval beginDraggingTime;
@property(nonatomic, assign) CFTimeInterval beginLoadingTime;

@end

@implementation JHSPullToRefreshControl

- (instancetype)initWithFrame:(CGRect)frame
{
  self = [super initWithFrame:frame];
  if (self) {
    self.view = [JHSMagicLampPullToRefreshView new];
  }
  return self;
}

- (IBAction)scrollViewPanned:(UIPanGestureRecognizer *)sender {
    if (_layoutManually) {
        return;
    }

    BOOL dragging = !(sender.state == UIGestureRecognizerStateCancelled ||
                      sender.state == UIGestureRecognizerStateEnded ||
                      sender.state == UIGestureRecognizerStateFailed);
    [self scrollViewDraggingStateChanged:dragging];
}

- (void)willMoveToSuperview:(UIView *)newSuperview {
    [super willMoveToSuperview:newSuperview];

    UIScrollView *scrollView = JHSObjectConvert(UIScrollView, self.superview);
    if (!scrollView) {
        return;
    }

    [scrollView removeObserver:self forKeyPath:KEY_PATH_CONTENT_OFFSET];
    [scrollView.panGestureRecognizer removeTarget:self action:@selector(scrollViewPanned:)];
}

- (void)didMoveToSuperview {
    [super didMoveToSuperview];

    UIScrollView *scrollView = JHSObjectConvert(UIScrollView, self.superview);
    if (!scrollView) {
        return;
    }

    [scrollView addObserver:self
                 forKeyPath:KEY_PATH_CONTENT_OFFSET
                    options:NSKeyValueObservingOptionNew | NSKeyValueObservingOptionOld
                    context:NULL];
    [scrollView.panGestureRecognizer addTarget:self action:@selector(scrollViewPanned:)];
}

- (void)observeValueForKeyPath:(NSString *)keyPath
                      ofObject:(id)object
                        change:(NSDictionary *)change
                       context:(void *)context {
    if (_layoutManually) {
        return;
    }

    if ([change[NSKeyValueChangeNewKey] isEqual:change[NSKeyValueChangeOldKey]]) {
        return;
    }

    UIScrollView *scrollView = JHSObjectConvert(UIScrollView, self.superview);
    JHSAssert(scrollView != nil, return );

    [self scrollViewContentOffsetChanged];
}

- (CGFloat)value {
    if (!_view || ![_view respondsToSelector:@selector(value)]) {
        return .0;
    }

    return _view.value;
}

- (BOOL)refreshing {
    return _view.loading;
}

- (void)setRefreshing:(BOOL)refreshing {
    if (_view.loading == refreshing) {
        return;
    }

    UIScrollView *scrollView = JHSObjectConvert(UIScrollView, self.superview);
    if (!scrollView) {
        return;
    }

    _view.loading = refreshing;

    BOOL immediate = self.sendsActionsImmediately;
    if (immediate && refreshing) {
        return;
    }

    // refreshing == YES时，延长duration和在completion中sendAction 有效防止抖动
    // 0.6秒很重要 古伦一级棒
    CFTimeInterval duration = refreshing ? .6 : .3;
    __weak typeof(self) weakSelf = self;
    __weak typeof(scrollView) weakScrollView = scrollView;

    if (immediate && refreshing) {
        self.beginLoadingTime = CACurrentMediaTime();
        [self sendActionsForControlEvents:UIControlEventValueChanged];
    }

    UIEdgeInsets inset;
    CGPoint offset;
    if (immediate) {
        offset = scrollView.contentOffset;
        if (self.position == kJHSPullToRefreshPositionTop) {
            offset.y = -scrollView.contentInset.top;
        } else {
            offset.y = scrollView.contentSize.height + scrollView.contentInset.bottom -
                       CGRectGetHeight(scrollView.bounds);
        }
    } else {
        inset = scrollView.contentInset;
        CGFloat diff = _view.loading ? _view.minDraggingDistance : -_view.minDraggingDistance;
        if (self.position == kJHSPullToRefreshPositionTop) {
            inset.top += diff;
        } else {
            inset.bottom += diff;
        }
    }

    [UIView animateWithDuration:duration
        animations:^(void) {
            if (immediate) {
                weakScrollView.contentOffset = offset;
            } else {
                weakScrollView.contentInset = inset;
            }
        }
        completion:^(BOOL finished) {
            if (!weakSelf || !refreshing || immediate) {
                return;
            }

            weakSelf.beginLoadingTime = CACurrentMediaTime();
            [weakSelf sendActionsForControlEvents:UIControlEventValueChanged];
        }];
}

- (void)setLayoutManually:(BOOL)layoutManually {
    if (layoutManually == _layoutManually) {
        return;
    }

    _layoutManually = layoutManually;

    [_view layoutWithPresenterState:self];
}

- (void)scrollViewDidScrolled {
    JHSAssert(_layoutManually, return );

    UIScrollView *scrollView = JHSObjectConvert(UIScrollView, self.superview);
    if (!scrollView) {
        return;
    }

    [self scrollViewDraggingStateChanged:YES];
    [self scrollViewContentOffsetChanged];
}

- (void)scrollViewDidEndDragging {
    JHSAssert(_layoutManually, return );

    UIScrollView *scrollView = JHSObjectConvert(UIScrollView, self.superview);
    if (!scrollView) {
        return;
    }

    [self scrollViewDraggingStateChanged:NO];
}

- (void)endRefreshing {
    self.refreshing = NO;
}

- (void)beginRefreshing {
  self.refreshing = YES;
}

- (void)scrollViewContentOffsetChanged {
    if (!_view.loading) {
        UIScrollView *scrollView = JHSObjectConvert(UIScrollView, self.superview);
        JHSAssert(scrollView != nil, return );

        CGFloat offsetY = .0;

        if (self.position == kJHSPullToRefreshPositionTop) {
            offsetY = -scrollView.contentOffset.y - scrollView.contentInset.top;
        } else {
            offsetY = scrollView.contentOffset.y + CGRectGetHeight(self.bounds) - scrollView.contentSize.height -
                      scrollView.contentInset.bottom;
        }
        _view.ready = offsetY >= _view.minDraggingDistance;
    }

    [_view layoutWithPresenterState:self];
}

- (void)scrollViewDraggingStateChanged:(BOOL)dragging {
    if (_dragging == dragging) {
        return;
    }

    _dragging = dragging;

    if (_dragging) {
        _beginDraggingTime = CACurrentMediaTime();
    } else if (!_view.loading && _view.ready) {
        self.refreshing = YES;
    }
}

- (void)layoutSubviews {
    [super layoutSubviews];

    UIScrollView *scrollView = JHSObjectConvert(UIScrollView, self.superview);
  
    _view.frame = CGRectMake(0, 64, CGRectGetWidth(scrollView.frame), CGRectGetHeight(scrollView.frame));
    [_view layoutWithPresenterState:self];
}

- (CGFloat)visibleHeight {
    UIScrollView *scrollView = JHSObjectConvert(UIScrollView, self.superview);
    if (!scrollView) {
        return .0;
    }

    CGFloat h = .0;

    if (self.position == kJHSPullToRefreshPositionTop) {
        h = -scrollView.contentOffset.y - scrollView.contentInset.top;
    } else {
        h = scrollView.contentOffset.y + CGRectGetHeight(self.bounds) - scrollView.contentSize.height -
            scrollView.contentInset.bottom;
    }
    if (_view.loading) {
        h += _view.minDraggingDistance;
    }

    return h;
}

- (void)setView:(UIView<JHSPullToRefreshViewObject> *)view {
    if (_view == view) {
        return;
    }

    [_view removeFromSuperview];
    [self addSubview:view];

    _view = view;
}

@end
